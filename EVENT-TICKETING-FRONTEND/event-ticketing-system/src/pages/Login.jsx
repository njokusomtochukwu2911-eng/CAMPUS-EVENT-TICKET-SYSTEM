import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axiosInstance.post('/auth/login', form);
      const payload = res.data?.user || res.data || {};
      const token = res.data?.token || res.data?.jwt || '';

      if (typeof login === 'function') {
        login(
          {
            email: payload.email || form.email,
            fullName: payload.fullName || '',
            role: payload.role || 'USER'
          },
          token
        );
      }

      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      let errorMessage = 'Invalid credentials';
      if (typeof data === 'string') errorMessage = data;
      else if (data && typeof data === 'object') errorMessage = data.message || data.error || 'Login failed';

      setError(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to access your account</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="form-group">
          <div>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}