import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';
import TripForm from './pages/TripForm';

const Private = ({ children }) => {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return user ? children : <Navigate to="/login" />;
};

const Public = ({ children }) => {
  const { user, ready } = useAuth();
  if (!ready) return null;
  return !user ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Private><Dashboard /></Private>} />
          <Route path="/trips/new" element={<Private><TripForm /></Private>} />
          <Route path="/trips/:id" element={<Private><TripDetails /></Private>} />
          <Route path="/trips/:id/edit" element={<Private><TripForm /></Private>} />
          <Route path="/login" element={<Public><Login /></Public>} />
          <Route path="/register" element={<Public><Register /></Public>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
