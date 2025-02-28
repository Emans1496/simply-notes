// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Stack,
  Snackbar,
  Alert,
  Grid,
  MenuItem,
  GlobalStyles
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Stati per aggiungere/modificare nota
  const [openAdd, setOpenAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  // Stato per ricerca e ordinamento
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date_desc');

  // Stato per Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' 
  });

  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchNotes = async () => {
    try {
      const res = await fetch('https://simply-notes-production.up.railway.app/notes.php', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Aggiunta nuova nota
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
        fetchNotes();
        setOpenAdd(false);
        setNewTitle('');
        setNewContent('');
        showSnackbar("Nota aggiunta con successo!", "success");
      } else {
        showSnackbar(data.message, "error");
      }
    } catch (err) {
      showSnackbar('Errore di connessione al server', "error");
    }
  };

  // Apertura dialog modifica
  const handleEditOpen = (note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setOpenEdit(true);
  };

  // Salvataggio modifica
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
        showSnackbar("Nota aggiornata con successo!", "success");
      } else {
        showSnackbar(data.message, "error");
      }
    } catch (err) {
      showSnackbar('Errore di connessione al server', "error");
    }
  };

  // Eliminazione nota
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
        showSnackbar("Nota eliminata con successo!", "success");
      } else {
        showSnackbar(data.message, "error");
      }
    } catch (err) {
      showSnackbar('Errore di connessione al server', "error");
    }
  };

  // Filtra note
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordina note
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortOption) {
      case 'date_desc':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'date_asc':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'title_asc':
        return a.title.localeCompare(b.title);
      case 'title_desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  return (
    <>
      {/* Definiamo l'animazione gradiente a livello globale, come in Login/Register */}
      <GlobalStyles styles={{
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      }} />

      {/* Box a schermo intero con gradiente animato */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(270deg,rgb(21, 202, 12),rgb(123, 160, 254), #86a8e7, #91eac9)',
          backgroundSize: '400% 400%',
          animation: 'gradientAnimation 12s ease infinite',
          p: 2
        }}
      >
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <img src="./simplyNotesLogo.png" alt="Logo" style={{ width: '300px' }} />
            <div>
              <Button
                variant="contained"
                onClick={() => setOpenAdd(true)}
                sx={{ mr: 2, backgroundColor: '#4caf50' }}
              >
                Aggiungi Nota
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </Stack>

          {/* Campo di ricerca e ordinamento */}
          <Card sx={{ mb: 2, boxShadow: 3 }}>
            <CardContent>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Cerca nota..."
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <TextField
                  select
                  label="Ordina per"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  variant="outlined"
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="date_desc">Data (più recenti-più vecchie)</MenuItem>
                  <MenuItem value="date_asc">Data (più vecchi-più)</MenuItem>
                  <MenuItem value="title_asc">Titolo A-Z</MenuItem>
                  <MenuItem value="title_desc">Titolo Z-A</MenuItem>
                </TextField>
              </Stack>
            </CardContent>
          </Card>

          {/* Messaggio di errore */}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {/* Lista delle note in Grid */}
          <Grid container spacing={2}>
            {sortedNotes.map(note => (
              <Grid item xs={12} sm={6} md={4} key={note.id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {note.title}
                      </Typography>
                      <div>
                        <IconButton color="primary" onClick={() => handleEditOpen(note)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteNote(note.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </Stack>
                    <Typography sx={{ mt: 1 }}>{note.content}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Dialog per aggiungere nota */}
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

      {/* Dialog per modificare nota */}
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

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
