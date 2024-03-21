import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import validator from "validator";
import fetch from "node-fetch";
import { createClient } from "redis";
import winston from "winston";

// dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Logger Configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const languageToJudge0Id = {
  javascript: 63,
  python: 71,
  java: 62,
};

function determineLanguageId(language) {
  return languageToJudge0Id[language.toLowerCase()] || null;
}

const redisClient = createClient({
    password: `${process.env.REDIS_PASSWORD}`,
    socket: {
        host: `${process.env.REDIS_HOST}`,
        port: process.env.REDIS_PORT
    }
});
redisClient.on("error", (err) => console.error("Redis error:", err));

await redisClient.connect();

process.on("beforeExit", async () => {
  try {
    await redisClient.quit();
    console.log("Redis client disconnected.");
  } catch (err) {
    console.error("Error disconnecting Redis client:", err);
  }
});

process.on("SIGTERM", async () => {
  logger.info("Received SIGTERM, shutting down gracefully...");
  try {
    await redisClient.quit();
    logger.info("Redis client disconnected.");
  } catch (err) {
    logger.error("Error during graceful shutdown:", err);
  } finally {
    process.exit(0);
  }
});
const pool = mysql.createPool(dbConfig);

// Input Validation
function validateSnippetInput(data) {
  if (!data.username || !data.code || !data.language) {
    throw new Error("Missing required fields.");
  }

  if (!validator.isLength(data.username, { min: 1, max: 100 })) {
    throw new Error("username must be between 1 and 100 characters.");
  }

  if (!validator.isLength(data.code, { min: 1, max: 10000 })) {
    throw new Error("Code must be between 1 and 10000 characters.");
  }

  const languageId = determineLanguageId(data.language);
  if (!languageId) {
    throw new Error("Invalid language.");
  }
}

function sanitizeInput(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong." });
});

app.get("/snippets", async (req, res, next) => {
  try {
    const cachedSnippets = await redisClient.get("codeSnippets");

    if (cachedSnippets) {
      res.status(200).json({status:200,result:JSON.parse(cachedSnippets)});
    } else {
      const [rows] = await pool.execute(`SELECT * FROM ${process.env.TABLE_NAME}`);
      redisClient.setEx("codeSnippets", 60, JSON.stringify(rows));
      res.status(200).json({status:200,result:rows});
    }
  } catch (err) {
    next(err);
  }
});

app.post("/snippets", async (req, res, next) => {
  try {
    const { username, language, stdin, code } = req.body;

    validateSnippetInput({ username, code, language, stdin });

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedCode = sanitizeInput(code);
    const sanitizedStdin = sanitizeInput(stdin);
    const containsNonPrintableChars = /[\x00-\x09\x0B-\x1F\x7F-\x9F]/;
    const base64Encoded =
      containsNonPrintableChars.test(sanitizedCode) ||
      containsNonPrintableChars.test(sanitizedStdin || "");

    const url =
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=" +
      base64Encoded +
      "&fields=*";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: JSON.stringify({
        language_id: determineLanguageId(language),
        source_code: base64Encoded
          ? Buffer.from(sanitizedCode).toString("base64")
          : sanitizedCode,
        stdin: base64Encoded
          ? Buffer.from(sanitizedStdin || "").toString("base64")
          : sanitizedStdin || "",
      }),
    };

    const response = await fetch(url, options);
    const submissionResult = await response.json();
    
    if (submissionResult.token) {
      let submissionDetails = submissionResult;

      // Initial check
      if (!submissionDetails.status || !submissionDetails.status.id) {
        const fetchUrl = `https://judge0-ce.p.rapidapi.com/submissions/${submissionResult.token}?base64_encoded=${base64Encoded}&fields=*`;
        const options = {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        };

        try {
          const fetchResponse = await fetch(fetchUrl, options);
          submissionDetails = await fetchResponse.json();
        } catch (error) {
          console.error("Error fetching initial submission details:", error);
        }
      }

      while (submissionDetails.status.id <= 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const fetchUrl = `https://judge0-ce.p.rapidapi.com/submissions/${submissionResult.token}?base64_encoded=${base64Encoded}&fields=*`;
        const options = {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        };

        const fetchResponse = await fetch(fetchUrl, options);
        submissionDetails = await fetchResponse.json();
      }

      let output = base64Encoded
        ? Buffer.from(
            submissionDetails.stdout || submissionDetails.stderr || "",
            "base64"
          ).toString()
        : submissionDetails.stdout || submissionDetails.stderr;

      const result = await pool.execute(
        `INSERT INTO ${process.env.TABLE_NAME} (username,stdin, code, language, output) VALUES (?, ?, ?, ?,?)`,
        [sanitizedUsername, sanitizedStdin, sanitizedCode, language, output]
      );

      await redisClient.del("codeSnippets");

      res.status(200).json({status:200,"message":"code snippet added succesfully"})
    } else {
      res.status(400).json({status:400, error: "Failed to create submission" });
    }
  } catch (err) {
    if (
      err.message === "Missing required fields." ||
      err.message === "Username must be between 1 and 100 characters." ||
      err.message === "Code must be between 1 and 10000 characters." ||
      err.message === "Invalid language."
    ) {
      res.status(400).json({ error: err.message });
    } else {
      logger.error(err.stack);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
