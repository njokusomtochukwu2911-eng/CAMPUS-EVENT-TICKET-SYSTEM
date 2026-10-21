import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import MyTickets from './pages/MyTickets';
import OrganizerDashboard from './pages/OrganizerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-tickets" element={
            <PrivateRoute role="USER"><MyTickets /></PrivateRoute>
          } />
          <Route path="/organizer" element={
            <PrivateRoute role="ORGANIZER"><OrganizerDashboard /></PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}