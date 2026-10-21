import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => {
        console.error('Fetch Event Error:', err);
        setMessage('Failed to load event details.');
        setIsError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setBuying(true);
    setMessage('');
    setIsError(false);

    try {
      await axiosInstance.post(`/tickets/buy/${id}`);
      setMessage('Ticket purchased successfully!');
      setIsError(false);

      // Refresh event details to update available ticket count
      const res = await axiosInstance.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error('Purchase Error:', err);
      const data = err.response?.data;
      let errorMsg = 'Purchase failed';

      // Safely parse error to prevent React rendering crashes
      if (typeof data === 'string') {
        errorMsg = data;
      } else if (data && typeof data === 'object') {
        errorMsg = data.message || data.error || JSON.stringify(data);
      } else if (err.message) {
        errorMsg = err.message;
      }

      setMessage(errorMsg);
      setIsError(true);
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '3rem' }}>Loading event details...</p>;
  }

  if (!event) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <h2>Event Not Found</h2>
          {message && <div className="error-banner">{message}</div>}
          <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem' }}>
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const available = event.availableTickets ?? (event.totalTickets - (event.ticketsSold || 0));

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div className="auth-card" style={{ maxWidth: '600px', width: '100%' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}
        >
          &larr; Back to Events
        </button>

        <h2 style={{ marginBottom: '0.5rem' }}>{event.title}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {event.description || 'No description available.'}
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <p style={{ margin: '0.25rem 0' }}><strong>Venue:</strong> {event.venue}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Date:</strong> {new Date(event.eventDate).toLocaleString()}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Price:</strong> ₦{event.price}</p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Available:</strong>{' '}
            <span style={{ color: available > 0 ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
              {available} / {event.totalTickets}
            </span>
          </p>
        </div>

        {message && (
          <div 
            className={isError ? 'error-banner' : ''} 
            style={!isError ? { color: '#15803d', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' } : { marginBottom: '1rem' }}
          >
            {message}
          </div>
        )}

        <button 
          onClick={handleBuy} 
          disabled={buying || available <= 0}
          className="btn-primary"
        >
          {available <= 0 ? 'Sold Out' : buying ? 'Processing...' : 'Buy Ticket'}
        </button>
      </div>
    </div>
  );
}