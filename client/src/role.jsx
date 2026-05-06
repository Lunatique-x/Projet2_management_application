import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";



export function Roles() { 
    //ajout du use contexte
    const { user } = useContext(AuthContext);

    if (!user || user.role_name !== "admin") {
        return (
            <div className="section">
                <h1 className="title is-4">Accès refusé</h1>
                <p>Vous n'avez pas les permissions nécessaires pour gérer les roles.</p>
                <Link to="/home">Retour à l'accueil</Link>
            </div>
        );
    }
     return (
        <div className="section" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            marginLeft: '25px'
        }}>
            <div className="card-box" style={{ maxWidth: '300px' }}>
                
                <div className="box">
                    
                   
                    {user.seeClients === 1 && (
                    <Link to="/clients" className="link">
                        <div className="boite ">Clients</div>
                    </Link>
                    )}

                    {user.seeStock === 1 && (
                    <Link to="/voitures" className="link">
                        <div className="boite">Voitures</div>
                    </Link>
                    )}
                    {user.modSell === 1 && (
                    <Link to="/factures" className="link">
                        <div className="boite">Factures</div>
                    </Link>
                    )}

                    <Link to="/employes" className="link">
                        <div className="boite">Employés</div>
                    </Link>
                     <Link to="/roles"className="siteactuel" >
                    <div className="boite" >Role</div>
                    </Link>

                </div>
            </div>
        </div>
    );
}