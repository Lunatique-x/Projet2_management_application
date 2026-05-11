import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";



export function Home() {
    //useContexte
    const { user } = useContext(AuthContext);

    if (!user) {
        return <div style={{ padding: '40px' }}>Chargement ou non connecté...</div>;
    }
    return (
        /* On remplace la classe "section" par une div simple pour éviter les marges de Bulma */
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
            paddingTop: '100px',
            boxSizing: 'border-box',
            paddingLeft: '40px',
            marginLeft: '0px',
            alignItems: 'flex-start'
        }}>
            <div className="card-box" style={{ maxWidth: '300px' }}>
                <div className="box">
                    {user.viewClients === 1 && (
                        <Link to="/clients" className="link">
                            <div className="boite">Clients</div>
                        </Link>
                    )}
                    {user.viewStock === 1 && (
                        <Link to="/voitures" className="link">
                            <div className="boite">Voitures</div>
                        </Link>
                    )}

                    {user.viewSell === 1 && (
                        <Link to="/factures" className="link">
                            <div className="boite">Factures</div>
                        </Link>
                    )}
                    {user.role_name === "admin" && (
                        <>
                            <Link to="/employes" className="link">
                                <div className="boite">Employés</div>
                            </Link>
                            <Link to="/roles" className="link">
                                <div className="boite">Role</div>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
