import { useState } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="bg-white rounded shadow p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="border rounded px-3 py-2 w-full" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border rounded px-3 py-2 w-full" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white rounded px-4 py-2 w-full" type="submit">Login</button>
        <p className="text-sm">No account? <Link className="text-blue-600" to="/signup">Sign up</Link></p>
      </form>
    </div>
  );
}
