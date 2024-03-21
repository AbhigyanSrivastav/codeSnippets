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

import { fetchSnippets } from '../api/config'; 

const SnippetDisplay = () => {
  const [snippets, setSnippets] = useState([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchSnippets();

        if (response.status === 200) {
          setSnippets(response.result);
        } else {
          console.error("Failed to fetch snippets:", response.status);
        }
      } catch (error) {
        console.error("Error fetching snippets:", error);
      }
    };

    fetchData(); 
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper sx={{ width: '80%', maxWidth: '1000px', overflowX: 'auto' }}> 
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
  {snippets
    .slice((page - 1) * itemsPerPage, page * itemsPerPage) 
    .map((snippet, index) => ( // Use index for serial number
      <TableRow 
        key={snippet.timestamp} 
        sx={{ 
          '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }, 
          '&:last-child td, &:last-child th': { border: 0 } 
        }}
      >
        <TableCell>{index + 1 + (page - 1) * itemsPerPage}</TableCell> {/* Serial Number */}
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

        <Pagination 
            count={Math.ceil(snippets.length / itemsPerPage)}  
            page={page} 
            onChange={handleChange} 
            sx={{ mt: 2, display: 'flex', justifyContent: 'center' }} 
        /> 
      </Paper>
    </Box>
  );
};

export default SnippetDisplay;
