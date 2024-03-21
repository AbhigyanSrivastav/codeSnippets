import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { createSnippet } from '../api/config';

const languages = ['C++', 'Java', 'JavaScript', 'Python'];

const SnippetForm = () => {
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');
  const [stdin, setStdin] = useState('');
  const [code, setCode] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newSnippet = {
      username,
      language,
      stdin,
      code,
    };
    try {
      debugger
      let response = await createSnippet(newSnippet)
      if (response.status === 200) {
        navigate('/display');
      }
    } catch (err) {
      console.log(err)
    } finally {
      // Reset form fields
      setUsername('');
      setLanguage('');
      setStdin('');
      setCode('');

    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        fullWidth
        required
      />
      <InputLabel id="language-select-label">Code Language</InputLabel>
      <Select
        labelId="language-select-label"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        fullWidth
        margin="normal"
        required
      >
        {languages.map((lang) => (
          <MenuItem key={lang} value={lang}>{lang}</MenuItem>
        ))}
      </Select>
      <TextField
        label="Standard Input (stdin)"
        value={stdin}
        onChange={(e) => setStdin(e.target.value)}
        margin="normal"
        fullWidth
      />
      <TextareaAutosize
        minRows={5}
        placeholder="Enter your code snippet..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{ width: '100%', marginTop: '10px' }}
        required
      />
      <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '15px' }}>
        Submit
      </Button>
    </form>
  );
};

export default SnippetForm;
