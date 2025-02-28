// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Stati per aggiungere una nota
  const [openAdd, setOpenAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Stati per modificare una nota
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Al mount (o quando cambia il token), carichiamo le note
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Legge tutte le note (GET su notes.php)
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // --- Aggiunta nuova nota (action=add)
  const handleAddNote = async () => {
    try {
      const res = await fetch('https://simply-notes-production.up.railway.app/notes.php', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'Bearer ' + token
        },
        body: new URLSearchParams({
          action: 'add',
          title: newTitle,
          content: newContent
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        // Ricarica le note e chiudi il dialog
        fetchNotes();
        setOpenAdd(false);
        setNewTitle('');
        setNewContent('');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Errore di connessione al server');
    }
  };

  // Apre il dialog di modifica
  const handleEditOpen = (note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setOpenEdit(true);
  };

  // --- Salvataggio modifica nota (action=update)
  const handleEditNote = async () => {
    if (!selectedNote) return;

    try {
      const res = await fetch('https://simply-notes-production.up.railway.app/notes.php', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'Bearer ' + token
        },
        body: new URLSearchParams({
          action: 'update',
          id: selectedNote.id,
          title: editTitle,
          content: editContent
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchNotes();
        setOpenEdit(false);
        setSelectedNote(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Errore di connessione al server');
    }
  };

  // --- Eliminazione nota (action=delete)
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa nota?")) return;
    try {
      const res = await fetch('https://simply-notes-production.up.railway.app/notes.php', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'Bearer ' + token
        },
        body: new URLSearchParams({
          action: 'delete',
          id: noteId
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchNotes();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Errore di connessione al server');
    }
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h4">Dashboard</Typography>
        <div>
          <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)} sx={{ mr: 2 }}>
            Aggiungi Nota
          </Button>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Stack>

      {/* Error message */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* List of notes */}
      {notes.map(note => (
        <Card key={note.id} sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{note.title}</Typography>
              <div>
                <IconButton color="primary" onClick={() => handleEditOpen(note)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteNote(note.id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            </Stack>
            <Typography>{note.content}</Typography>
          </CardContent>
        </Card>
      ))}

      {/* Dialog per aggiungere una nota */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Aggiungi Nuova Nota</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titolo"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contenuto"
            fullWidth
            multiline
            rows={4}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Annulla</Button>
          <Button variant="contained" onClick={handleAddNote}>Aggiungi</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per modificare una nota */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Modifica Nota</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titolo"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Contenuto"
            fullWidth
            multiline
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Annulla</Button>
          <Button variant="contained" onClick={handleEditNote}>Salva</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
