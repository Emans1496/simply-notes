// src/App.js
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
      },
    }), [darkMode]
  );

  const toggleTheme = () => {
    setDarkMode(prev => !prev);
  };

  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Bottone per toggle tema, posizionato in alto a destra */}
        <IconButton onClick={toggleTheme} sx={{ position: 'fixed', top: 16, right: 16 }}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
