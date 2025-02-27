import React, { useState, useEffect } from 'react';

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

    fetchNotes();
  }, [token]);

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
      <ul>
        {notes.map(note => (
          <li key={note.id} className="bg-white p-4 rounded shadow mb-2">
            <h3 className="text-xl font-bold">{note.title}</h3>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
