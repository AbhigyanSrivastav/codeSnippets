import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { createSnippet } from '../api/config';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';

const languages = ['C++', 'Java', 'JavaScript', 'Python'];

const SnippetForm = () => {
  const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');
  const [stdin, setStdin] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsDialogOpen(true); // Open the dialog
    setIsLoading(true); 
    const newSnippet = {
      username,
      language,
      stdin,
      code,
    };
    try {

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
      setIsLoading(false); 
      setIsDialogOpen(false); 
    }

  };

  return (
    <>
      <Dialog open={isDialogOpen}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <CircularProgress sx={{ marginRight: 2 }} />
        <span>Wait while the code is submitting...</span>
      </Box>
    </Dialog>
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%'
    }}>
      <Box sx={{
        width: '500px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px'
      }}>
        <form onSubmit={handleSubmit} >
        <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
          <Grid item xs={12} >
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal // Optionally disable portal for positioning if needed
              id="language-select"
              options={languages}
              value={language}
              onChange={(event, newValue) => setLanguage(newValue)} // Update onChange handler
              fullWidth
              margin="normal"
              required
              renderInput={(params) =>
                <TextField {...params} label="Code Language" />
              }
            />
          </Grid>

          <Grid item xs={12} >
            <TextField
              label="Standard Input (stdin)"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              margin="normal"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} >
            <textarea
              rows="5"  // Initial rows
              placeholder="Enter your code snippet..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ width: '100%', marginTop: '10px' }}
              required
            ></textarea>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '15px' }}>
              Submit
            </Button>
          </Grid>
        </Grid>
        </form>
      </Box>
    </Box>
    </>
  );
};

export default SnippetForm;
