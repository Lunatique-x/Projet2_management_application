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

export function Router() {
  return (
    <div className="container">
      <BrowserRouter>
        <Menu />
        <Routes >
            {/* <Route element={<ProtectedRoute />}> */}
                <Route path="/" element={<Home />} />
                <Route path="/Client" element={<Clients />} />
                <Route path="/Voiture" element={<Voiture />} />
                <Route path="/Facture" element={<Factures />} />
                <Route path="/Employe" element={<Employe />} />
                    
            {/* </Route> */}
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Error404 />} />





        </Routes>
       
      </BrowserRouter>
    </div>
  );
}
