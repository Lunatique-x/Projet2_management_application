import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import { AuthProvider } from './AuthContext';// ajout pour appiquer le use Contexte
// ajout de AuthProvider
export function Router() {
  return (
    <AuthProvider>
      <div className="container is-fluid">
        <BrowserRouter>
          <Menu />
          <Routes >
            {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/home" element={<Home />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/voitures" element={<Voiture />} />
            <Route path="/factures" element={<Factures />} />
            <Route path="/employes" element={<Employe />} />
            <Route path="/roles" element={<Roles />} />

            {/* </Route> */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error404 />} />





          </Routes>

        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}
