import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AfficherEmploye } from "./AfficherEmploye";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function Employe() {
    //useContexte
    const { user } = useContext(AuthContext);
    const [employes, setEmployes] = useState([]);

    if (!user || user.role_name !== "admin") {
        return (
            <div className="section">
                <h1 className="title is-4">Accès refusé</h1>
                <p>Vous n'avez pas les permissions nécessaires pour gérer les employés.</p>
                <Link to="/home">Retour à l'accueil</Link>
            </div>
        );
    }
    

    useEffect(() => {
        async function getEmployes() {
            const res = await fetch("http://localhost:3000/allEmploye", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                const data = await res.json();
                setEmployes(data);
            }
        }

        getEmployes();
    }, []);

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

                    <Link to="/employes" className="siteactuel">
                        <div className="boite">Employés</div>
                    </Link>
                     <Link to="/roles"className="link" >
                    <div className="boite" >Role</div>
                    </Link>

                </div>
            </div>
            <div className="container">
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {employes.map((employe) => {
                            return <AfficherEmploye key={employe.id_employe} employe={employe} />;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}