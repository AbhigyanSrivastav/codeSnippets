import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';
// import InputLabel from '@mui/material/InputLabel';
// import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { createSnippet } from '../api/config';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import CustomDialog from './AlertDialog';

const languages = ['Java', 'JavaScript', 'Python'];
const SnippetForm = () => {
const [username, setUsername] = useState('');
  const [language, setLanguage] = useState('');
  const [stdin, setStdin] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogSeverity, setDialogSeverity] = useState('success');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const newSnippet = {
      username,
      language,
      stdin,
      code,
    };
    try {
      const response = await createSnippet(newSnippet);
      if (response.status === 200) {
        setDialogMessage(response.message);
        setDialogSeverity('success');
        setDialogOpen(true);
      } else {
        setDialogMessage(response.error);
        setDialogSeverity('error');
        setDialogOpen(true);
      }
    } catch (err) {
      setDialogMessage('An error occurred');
      setDialogSeverity('error');
      setDialogOpen(true);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (dialogSeverity === 'success') {
      navigate('/display');
    }
    // Reset form fields
    setUsername('');
    setLanguage('');
    setStdin('');
    setCode('');
  };

  return (
    <>
      <CustomDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        message={dialogMessage}
        severity={dialogSeverity}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '89vh',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '500px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          backgroundColor: 'white' 

          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
              <Grid item xs={12}>
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
                  disablePortal
                  id="language-select"
                  options={languages}
                  value={language}
                  onChange={(event, newValue) => setLanguage(newValue)}
                  fullWidth
                  margin="normal"
                  required
                  renderInput={(params) => <TextField {...params} label="Code Language" />}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Standard Input (stdin)"
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  margin="normal"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <textarea
                  rows="5"
                  placeholder="Enter your code snippet..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ width: '100%', marginTop: '10px' }}
                  required
                ></textarea>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '15px' }}>
                  {isLoading ? 'Submitting...' : 'Submit'}
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