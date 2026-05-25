import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Securite/authContext";

export function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname.toLowerCase() === "/";
  const { user, logout } = useContext(AuthContext);

  const handleAuthClick = () => {
    if (user) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation" 
         style={{ backgroundColor: 'transparent' }}> {/* On s'assure que la barre est transparente ou de la bonne couleur */}
      
      <div className="container is-fluid" style={{
        display: 'flex', 
        width: '100%', 
        maxWidth: '100%',
        paddingLeft: '40px',  // On donne du souffle à gauche (aligné avec tes boutons Clients)
        paddingRight: '40px', // On donne du souffle à droite pour le bouton Déconnexion
        margin: '0'
      }}>

        <div className="navbar-brand">
          {/* Home link moved to Home hero; keep navbar-brand for logo or future items */}
        </div>

        <div className="navbar-menu is-active" style={{ display: 'flex', flexGrow: 1, backgroundColor: 'transparent' }}>
          <div className="navbar-end" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
            <div className="menu-top-buttons" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={handleHomeClick}
                className="home-hero__auth-btn"
                aria-label="Home"
              >
                Home
              </button>
              <button
                onClick={handleAuthClick}
                className="home-hero__auth-btn"
                aria-label={user ? "Se déconnecter" : "Se connecter"}
              >
                {user ? "Déconnexion" : "Connexion"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}