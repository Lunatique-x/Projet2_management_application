import { Link, useNavigate } from "react-router-dom";
import { AfficherFacture } from "./Facture/AfficherFacture";
import { useState, useEffect } from "react";
import { CreeFacture } from "./Facture/CreeFacture";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";



export function Factures() {
    //useContexte
    const { user } = useContext(AuthContext);
    const [factures, setFactures] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    if (!user || user.modSell !== 1) {
        return <div className="section">Accès refusé : vous n'avez pas la permission de voir les facutures.</div>;
    }

    useEffect(() => {
        getFactures();
    }, []);

    async function getFactures() {
        const res = await fetch("http://localhost:3000/allFactures", { 
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });

        if (res.ok) {
            const data = await res.json();
            setFactures(data);
        } else {
            console.error("Erreur lors de la récupération des factures");
        }
    }

    const handleFactureCreated = () => {
        getFactures();
    };

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

                    <Link to="/factures" className="siteactuel">
                        <div className="boite">Factures</div>
                    </Link>
                    {user.role_name === "admin" && (  
                    <>
                      
                    <Link to="/employes" className="link">
                        <div className="boite">Employés</div>
                    </Link>
                     <Link to="/roles"className="link" >
                    <div className="boite" >Role</div>
                    </Link>
                    </>
                    )}

                </div>
            </div>
            <div className="container">
                <div className="section">
                    <div className="row">
                        <button 
                            className="button is-primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Créer une Facture
                        </button>
                    </div>
                </div>
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {factures.map((f) => {
                            return <AfficherFacture key={f.id_payement} facture={f} />;
                        })}
                    </div>
                </div>
            </div>
            <CreeFacture 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onFactureCreated={handleFactureCreated}
            />
        </div>
    );
}