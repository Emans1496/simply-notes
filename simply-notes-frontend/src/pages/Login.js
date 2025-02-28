// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography
} from '@mui/material';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://simply-notes-production.up.railway.app/login.php', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password })
      });
      const data = await res.json();

      console.log('Login response:', data);

      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
        window.location.reload(); //non si rendereizza correttamente alla dashboard
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Errore di connessione al server');
    }
  };
  
  return (
    <Container maxWidth="sm" sx={{ marginTop: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>Login</Typography>
          {error && (
            <Typography color="error" sx={{ marginBottom: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Login
            </Button>

            <Typography align="center" sx={{ marginTop: 2 }}>
              Non hai un account? <Link to="/register">Registrati</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
