import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axiosInstance.post('/auth/register', form);

      const payload = res.data?.user || res.data || {};
      const token = res.data?.token || res.data?.jwt || '';

      if (typeof login === 'function') {
        login(
          {
            email: payload.email || form.email,
            fullName: payload.fullName || form.fullName,
            role: payload.role || form.role
          },
          token
        );
      }

      navigate('/');
    } catch (err) {
      console.error('Registration Error:', err);

      const data = err.response?.data;
      let errorMessage = 'Registration failed';
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data && typeof data === 'object') {
        errorMessage = data.message || data.error || JSON.stringify(data);
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us to discover and manage events</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="form-group">
          <div>
            <input
              name="fullName"
              placeholder="Full Name"
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
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
          <div>
            <select
              name="role"
              onChange={handleChange}
              value={form.role}
              className="input-field"
            >
              <option value="USER">Student / Attendee</option>
              <option value="ORGANIZER">Organizer</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}