import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { fetchSnippets } from '../api/config';

const SnippetDisplay = () => {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSnippets();
        debugger
        if (response.status === 200) {
          setSnippets(response.result)
          // Process the fetched data here
        } else {
          // Handle non-200 status codes (errors)
          console.error("Failed to fetch snippets:", response.status);
        }
      } catch (error) {
        // Handle network or other errors
        console.error("Error fetching snippets:", error);
      }
    };
  
    fetchData(); // Call the async function 
  }, []);
  

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Code Language</TableCell>
            <TableCell>stdin</TableCell>
            <TableCell>Code (Truncated)</TableCell>
            <TableCell>stdout</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {snippets.map((snippet) => (
            <TableRow key={snippet.timestamp}>
              <TableCell>{snippet.username}</TableCell>
              <TableCell>{snippet.language}</TableCell>
              <TableCell>{snippet.stdin}</TableCell>
              <TableCell>{snippet.code.substring(0, 100)}...</TableCell> 
              <TableCell>{snippet.output}</TableCell> 
              <TableCell>{snippet.timestamp}</TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SnippetDisplay;
