import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Securite/authContext";
import { useContext } from "react";
import voitureHome from "../assets/voiturehome.png";



export function Home() {
    //useContexte
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAuthClick = () => {
        if (user) {
            logout();
            navigate("/");
        } else {
            navigate("/login");
        }
    };

    const handleHomeClick = () => {
        // Si on est déjà sur la home, recharger la page
        if (window.location.pathname === "/" || window.location.pathname === "/home") {
            window.location.reload();
        } else {
            navigate("/");
        }
    };
    return (
        <div className="home-hero">
            <div className="home-hero__noise" aria-hidden="true"></div>
            
            <div className="home-hero__content">
                <section className="home-hero__copy">
                    <p className="home-hero__eyebrow">Gestion du Concessionnaire</p>
                    <br />
                    <h1 className="home-hero__title">
                        ADHK
                    </h1>
                    <br />
                    <br />
                    <br />
                    <p className="home-hero__subtitle">
                        Une interface claire pour gérer vos clients, vos voitures et vos factures dans un seul espace.
                    </p>

                    <div className="home-hero__actions">
                        {user && user.viewStock === 1 && (
                            <Link to="/voitures" className="hero-btn hero-btn--primary">
                                Gérer les voitures
                            </Link>
                        )}
                        {user && user.viewClients === 1 && (
                            <Link to="/clients" className="hero-btn hero-btn--secondary">
                                Accéder aux clients
                            </Link>
                        )}
                    </div>

                    <div className="home-hero__links">
                        {user && user.viewClients === 1 && (
                            <Link to="/clients" className="hero-link-pill">
                                Clients
                            </Link>
                        )}
                        {user && user.viewStock === 1 && (
                            <Link to="/voitures" className="hero-link-pill">
                                Voitures
                            </Link>
                        )}
                        {user && user.viewSell === 1 && (
                            <Link to="/factures" className="hero-link-pill">
                                Factures
                            </Link>
                        )}
                        {user && user.role_name === "admin" && (
                            <>
                                <Link to="/employes" className="hero-link-pill">
                                    Employés
                                </Link>
                                <Link to="/roles" className="hero-link-pill">
                                    Rôle
                                </Link>
                            </>
                        )}
                    </div>
                </section>

                <section className="home-hero__visual" aria-hidden="true">
                    <div className="home-hero__image-frame">
                        <div className="home-hero__image-glow"></div>
                        <img className="home-hero__image" src={voitureHome} alt="Luxury car" />
                    </div>
                </section>
            </div>
        </div>
    );
}
