import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Campus Events</Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user?.role === 'USER' && <Link to="/my-tickets">My Tickets</Link>}
        {user?.role === 'ORGANIZER' && <Link to="/organizer">Dashboard</Link>}
        {user && <button onClick={handleLogout}>Logout</button>}
      </div>
    </nav>
  );
}