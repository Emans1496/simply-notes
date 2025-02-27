// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [notes, setNotes]         = useState([]);
  const [error, setError]         = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [title, setTitle]         = useState('');
  const [content, setContent]     = useState('');
  
  const token = localStorage.getItem('token');

  const fetchNotes = async () => {
    try {
      const res = await fetch('https://simply-notes.wuaze.com/notes.php', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.json();
      if(data.status === 'success'){
        setNotes(data.notes);
      } else {
        setError(data.message);
      }
    } catch(err) {
      setError('Errore di connessione al server');
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openModal = (note = null) => {
    setCurrentNote(note);
    setTitle(note ? note.title : '');
    setContent(note ? note.content : '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentNote(null);
    setTitle('');
    setContent('');
  };

  const handleSave = async () => {
    let url = 'https://simply-notes.wuaze.com/notes.php';
    let formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if(currentNote){
      // Aggiornamento
      formData.append('id', currentNote.id);
      url += '?action=update';
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      });
      const data = await res.json();
      if(data.status === 'success'){
        closeModal();
        fetchNotes();
      } else {
        alert(data.message);
      }
    } catch(err) {
      alert('Errore di connessione al server');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Sei sicuro di voler eliminare questa nota?")){
      let formData = new FormData();
      formData.append('id', id);
      try {
        const res = await fetch('https://simply-notes.wuaze.com/notes.php?action=delete', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          body: formData
        });
        const data = await res.json();
        if(data.status === 'success'){
          fetchNotes();
        } else {
          alert(data.message);
        }
      } catch(err) {
        alert('Errore di connessione al server');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl">Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-2">{note.title}</h3>
            <p className="mb-2">{note.content}</p>
            <div className="flex justify-end space-x-2">
              <button onClick={()=>openModal(note)} className="bg-blue-500 text-white px-3 py-1 rounded">Modifica</button>
              <button onClick={()=>handleDelete(note.id)} className="bg-red-500 text-white px-3 py-1 rounded">Elimina</button>
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={()=>openModal()} 
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full text-2xl"
      >
        +
      </button>
      
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-xl mb-4">{currentNote ? "Modifica Nota" : "Nuova Nota"}</h3>
            <div className="mb-4">
              <input 
                type="text" 
                placeholder="Titolo" 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)} 
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-4">
              <textarea 
                placeholder="Contenuto" 
                value={content} 
                onChange={(e)=>setContent(e.target.value)} 
                className="w-full border px-3 py-2 rounded" 
                rows="4"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button onClick={closeModal} className="px-4 py-2 border rounded">Annulla</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Salva</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
