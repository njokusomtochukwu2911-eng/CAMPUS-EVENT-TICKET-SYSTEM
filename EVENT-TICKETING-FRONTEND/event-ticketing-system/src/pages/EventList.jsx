import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/events')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading events...</p>;

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem' }}>
      <h2>Upcoming Campus Events</h2>
      {events.length === 0 && <p>No events available yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.map((event) => (
          <div key={event.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
            <h3>{event.title}</h3>
            <p>{event.venue} — {new Date(event.eventDate).toLocaleString()}</p>
            <p>₦{event.price} • {event.availableTickets} tickets left</p>
            <Link to={`/events/${event.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}