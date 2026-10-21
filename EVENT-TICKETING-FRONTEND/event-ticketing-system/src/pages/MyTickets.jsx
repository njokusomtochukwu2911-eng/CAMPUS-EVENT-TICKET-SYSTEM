import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/tickets/my')
      .then((res) => setTickets(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading your tickets...</p>;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '0 1rem' }}>
      <h2>My Tickets</h2>
      {tickets.length === 0 && <p>You haven't purchased any tickets yet.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tickets.map((ticket) => (
          <div key={ticket.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem' }}>
            <h3>{ticket.event.title}</h3>
            <p>{ticket.event.venue} — {new Date(ticket.event.eventDate).toLocaleString()}</p>
            <p><strong>Ticket Code:</strong> {ticket.ticketCode}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}