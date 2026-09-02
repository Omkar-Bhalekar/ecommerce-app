import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loader />;
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
