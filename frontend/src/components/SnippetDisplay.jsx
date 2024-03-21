import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination'; 
import TextField from '@mui/material/TextField'; 
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { fetchSnippets } from '../api/config'; 

const SnippetDisplay = () => {
  const [snippets, setSnippets] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ language: '', username: '', timestamp: '' }); 
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchSnippets();
        if (response.status === 200) {
          setSnippets(response.result);
          setError(null); 
        } else {
          console.error("Failed to fetch snippets:", response.status);
          setError('Failed to fetch snippets');
        }
      } catch (error) {
        console.error("Error fetching snippets:", error);
        setError('An error occurred while fetching snippets'); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(); 
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSnippets = snippets.filter(snippet => {
    return snippet.language.toLowerCase().includes(filters.language.toLowerCase()) &&
      snippet.username.toLowerCase().includes(filters.username.toLowerCase()) &&
      // Logic for timestamp filtering if needed
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '89vh' }}>
      <Paper sx={{ width: '90%', maxWidth: '1000px', overflowX: 'auto', p: 2 }}> 
      <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}> 
  <TextField label="Filter by Language" name="language" value={filters.language} onChange={handleFilterChange} />
  <TextField label="Filter by Username" name="username" value={filters.username} onChange={handleFilterChange} />
  <TextField label="Search Code" value={searchTerm} onChange={handleSearchChange} />
</Box> 

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress />
            <Typography>Loading Snippets...</Typography>
          </Box> 
        ) : error ? (
          <Typography variant="body1" color="error">{error}</Typography>
        ) : (
          <TableContainer sx={{ minHeight: 200 }}>
            <Table size="small" stickyHeader> 
              <TableHead>
                <TableRow>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Sr. no</TableCell>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Username</TableCell>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Code Language</TableCell>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>stdin</TableCell>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Code (Truncated)</TableCell>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>stdout</TableCell>
                  <TableCell sx={{ backgroundColor: 'black', color: 'white' }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSnippets
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage) 
                  .map((snippet, index) => ( 
                    <TableRow 
                      key={snippet.timestamp}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell>{index + 1 + (page - 1) * itemsPerPage}</TableCell>
                      <TableCell>{snippet.username}</TableCell>
                      <TableCell>{snippet.language}</TableCell>
                      <TableCell>{snippet.stdin}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', padding: '8px' }}>
                        {snippet.code.substring(0, 100)}...
                      </TableCell>
                      <TableCell>{snippet.output}</TableCell>
                      <TableCell>{snippet.timestamp}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Pagination 
          count={Math.ceil(filteredSnippets.length / itemsPerPage)} 
          page={page} 
          onChange={handleChange} 
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} 
        /> 
      </Paper>
    </Box>
  );
};

export default SnippetDisplay;

