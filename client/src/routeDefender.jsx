import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Si le token n'existe pas, on redirige vers la page de connexion
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si le token existe, on affiche les composants enfants (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;