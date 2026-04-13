import { Link, useNavigate,useLocation } from "react-router-dom"; // On ajoute useNavigate

export function Menu() {
  const navigate = useNavigate(); // On initialise la fonction de navigation
  const location = useLocation();

  
  const isLoginPage = location.pathname.toLowerCase() === "/";
  
  
  // Si on est sur le login, ou si on n'a pas de token, on ne renvoie rien (null)
  if (isLoginPage ) {
    return null;
  }

  const handleLogout = () => {
    // 1. Ici, tu ajouteras plus tard ta logique (supprimer le token, vider le localStorage, etc.)
    console.log("Utilisateur déconnecté");
    localStorage.removeItem('token');

    // 2. Redirection vers la page de connexion
    navigate("/"); 
  };
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-menu" style={{ display: 'flex', width: '100%',backgroundColor:"white",borderRadius: "12px",overflow: "hidden" }}>
        
        {/* Ce qui reste à gauche */}
        <div className="navbar-start">
          <Link to="/home" className="navbar-item">
            Home
          </Link>
        </div>

        <div className="navbar-end" style={{ marginLeft: 'auto' }}>
          <div className="navbar-item">
            {/* On utilise onClick pour appeler notre fonction */}
            <button 
              className="button is-danger" 
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
}