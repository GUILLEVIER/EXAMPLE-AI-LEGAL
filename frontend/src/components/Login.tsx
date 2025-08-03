import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://beriuson.pythonanywhere.com/';

const Login: React.FC<{ onLogin?: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        username,
        email,
        password,
      });
      console.log("RESPONSE: ", response.data.data.access)
      // Guarda el token en localStorage
      localStorage.setItem('access', response.data.data.access);
      localStorage.setItem('refresh', response.data.data.refresh);
      if (onLogin) onLogin();
      window.location.reload();
    } catch (err: any) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      {error && <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login; 