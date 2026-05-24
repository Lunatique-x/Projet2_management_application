import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./routeDefender";
import { Menu } from "./menu";
import { Home } from "./home";
import { Clients } from "./clients";
import { Voiture } from "./voitures";
import { Factures } from "./factures";
import { Login } from "./login";
import { Error404 } from "./error404";
import { Employe } from "./employe";
import { Roles } from "./role";
import { AuthProvider } from './authContext';
import { useContext } from "react";
import { AuthContext } from "./authContext";

function AppRoutes() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container is-fluid">
      <BrowserRouter>
        {user && <Menu />}
        <Routes>
          {/* Route de login (accessible à tous) */}
          <Route path="/login" element={<Login />} />

          {/* Routes protégées - affichées seulement si utilisateur connecté */}
          {user && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/voitures" element={<Voiture />} />
              <Route path="/factures" element={<Factures />} />
              <Route path="/employes" element={<Employe />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
            </>
          )}

          {/* Redirection vers login si pas connecté */}
          {!user && <Route path="/" element={<Navigate to="/login" replace />} />}

          {/* 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export function Router() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
