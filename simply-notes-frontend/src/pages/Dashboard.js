// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await fetch('https://simply-notes-production.up.railway.app/notes.php', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await res.json();
        if (data.status === 'success') {
          setNotes(data.notes);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Errore di connessione al server');
      }
    };

    fetchNotes();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <Typography variant="h4">Dashboard</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <Typography color="error" sx={{ marginBottom: 2 }}>
          {error}
        </Typography>
      )}

      {/* List of notes */}
      {notes.map(note => (
        <Card key={note.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {note.title}
            </Typography>
            <Typography>{note.content}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default Dashboard;
