import { Link, useNavigate, useLocation } from "react-router-dom";

export function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname.toLowerCase() === "/";

  if (isLoginPage) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
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
          <Link to="/home" className="navbar-item" style={{ paddingLeft: '0' }}>
            Home
          </Link>
        </div>

        <div className="navbar-menu is-active" style={{ display: 'flex', flexGrow: 1, backgroundColor: 'transparent' }}>
          <div className="navbar-end" style={{ marginLeft: 'auto', display: 'flex' }}>
            <div className="navbar-item" style={{ paddingRight: '0' }}>
              <button
                className="button is-danger"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}