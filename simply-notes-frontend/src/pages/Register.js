import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
      setError("Le password non coincidono");
      return;
    }

    try {
      const res = await fetch('https://simply-notes.wuaze.com/register.php', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password })
      });
      const data = await res.json();
      if(data.status === 'success'){
        navigate('/login');
      } else {
        setError(data.message);
      }
    } catch(err) {
      setError('Errore di connessione al server');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl mb-4">Registrazione</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input type="email" className="w-full border px-3 py-2 rounded" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input type="password" className="w-full border px-3 py-2 rounded" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Conferma Password</label>
          <input type="password" className="w-full border px-3 py-2 rounded" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Registrati</button>
        <p className="mt-4 text-center">
          Hai già un account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
