// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  GlobalStyles,
  CircularProgress,
  Stack
} from '@mui/material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://simply-notes-production.up.railway.app/register', {
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
    setLoading(false);
  };
  
  return (
    <>
      <Helmet>
        <title>Registrazione - Simply Notes</title>
      </Helmet>

      <GlobalStyles styles={{
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }} />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(270deg, rgb(21,202,12), rgb(123,160,254), #86a8e7, #91eac9)',
          backgroundSize: '400% 400%',
          animation: 'gradientAnimation 12s ease infinite',
          p: 2
        }}
      >
        <Container maxWidth="xs">
          <img
            src="/simplyNotesLogo.png"
            alt="Logo"
            style={{
              display: 'block',
              margin: '0 auto',
              marginBottom: '20px',
              width: '300px'
            }}
          />
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Iscriviti
              </Typography>

              {error && (
                <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              {loading ? (
                <Stack alignItems="center" sx={{ mt: 4 }}>
                  <CircularProgress />
                </Stack>
              ) : (
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
                    sx={{ mt: 2 }}
                  >
                    Registrati
                  </Button>
                  <Typography align="center" variant="body2" sx={{ mt: 2 }}>
                    Hai già un account? <Link to="/login">Login</Link>
                  </Typography>
                </form>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Register;
