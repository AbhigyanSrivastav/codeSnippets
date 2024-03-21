import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SnippetForm from './components/SnippetForm';
import SnippetDisplay from "./components/SnippetDisplay";
import NavBar from './components/Navbar';
import './App.css'
const App = () => {
  return (
    <BrowserRouter>
    <NavBar/>
      <Routes>
        <Route path="/" element={<SnippetForm />}/>
        <Route path="/display" element={<SnippetDisplay />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
