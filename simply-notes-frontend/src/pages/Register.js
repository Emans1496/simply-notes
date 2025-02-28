// src/pages/Register.js
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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }

    try {
      const res = await fetch('https://simply-notes-production.up.railway.app/register.php', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password })
      });
      const data = await res.json();

      if (data.status === 'success') {
        navigate('/login');
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
          <Typography variant="h5" gutterBottom>Registrazione</Typography>
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
            <TextField
              label="Conferma Password"
              fullWidth
              margin="normal"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              variant="contained"
              type="submit"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Registrati
            </Button>

            <Typography align="center" sx={{ marginTop: 2 }}>
              Hai già un account? <Link to="/login">Login</Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Register;
