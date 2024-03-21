import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SnippetForm from './components/SnippetForm';
import SnippetDisplay from "./components/SnippetDisplay";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SnippetForm />}/>
        <Route path="/display" element={<SnippetDisplay />}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
