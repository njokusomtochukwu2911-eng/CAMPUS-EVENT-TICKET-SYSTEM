import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function OrganizerDashboard() {
  const { user } = useAuth(); // Retrieve current logged-in user
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    price: '',
    totalTickets: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMyEvents = async () => {
    try {
      const res = await axiosInstance.get('/events/my');
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Format datetime string into ISO format for LocalDateTime (e.g. 2026-10-08T18:00:00)
      const formattedDate = form.date ? new Date(form.date).toISOString().slice(0, 19) : null;

      // Construct payload matching exact Event.java model fields
      const payload = {
        title: form.title,
        description: form.description,
        venue: form.venue,
        eventDate: formattedDate,
        price: parseFloat(form.price) || 0.00,
        totalTickets: parseInt(form.totalTickets, 10) || 0,
        organizer: user ? { id: user.id, email: user.email } : null
      };

      await axiosInstance.post('/events', payload);

      setSuccess('Event created successfully!');
      setForm({
        title: '',
        description: '',
        venue: '',
        date: '',
        price: '',
        totalTickets: ''
      });
      fetchMyEvents();
    } catch (err) {
      console.error('Create Event Error:', err);

      const data = err.response?.data;
      let errorMessage = 'Failed to create event';

      // Safely extract error string to prevent React white-screen rendering crashes
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data && typeof data === 'object') {
        errorMessage = data.message || data.error || JSON.stringify(data);
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '2rem' }}>
      <div className="auth-card" style={{ maxWidth: '600px' }}>
        <h2 className="auth-title">Organizer Dashboard</h2>
        <p className="auth-subtitle">Create and manage your events</p>

        {error && <div className="error-banner">{error}</div>}
        {success && (
          <div style={{ color: '#15803d', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-group">
          <div>
            <input
              name="title"
              placeholder="Event Title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="input-field"
              rows="3"
            />
          </div>
          <div>
            <input
              name="venue"
              placeholder="Venue / Location"
              value={form.venue}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <input
              name="date"
              type="datetime-local"
              value={form.date}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price ($)"
              value={form.price}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <div>
            <input
              name="totalTickets"
              type="number"
              placeholder="Total Tickets Available"
              value={form.totalTickets}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>

        <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />

        <h3>Your Events</h3>
        {events.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>No events created yet.</p>
        ) : (
          <ul style={{ marginTop: '1rem', listStyle: 'none' }}>
            {events.map((event, index) => (
              <li key={event.id || index} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                <strong>{event.title}</strong> — ${event.price} ({event.venue})
                <br />
                <small style={{ color: 'var(--text-muted)' }}>
                  Date: {event.eventDate} | Tickets: {event.totalTickets}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}