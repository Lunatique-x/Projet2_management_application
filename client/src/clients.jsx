import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AfficherClient } from "./Client/AfficherClient";
import { CreeClient } from "./Client/CreeClient";
import { ModifierClient } from "./Client/ModifierSupprimerClient";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
 

export function Clients() {
    //useContexte
    const { user } = useContext(AuthContext);
    const [client, setClient] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    if (!user || user.seeClients !== 1) {
        return <div className="section">Accès refusé : vous n'avez pas la permission de voir les clients.</div>;
    }

    useEffect(() => {
        getClient();
    }, []);

    async function getClient() {
        const res = await fetch("http://localhost:3000/allClient", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            setClient(data);
        }
    }

    const handleClient = () => {
        getClient();
    };

    const handleEditClick = (clientToEdit) => {
        setSelectedClient(clientToEdit);
        setIsEditModalOpen(true);
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
                    
                   
                    <Link to="/clients" className="siteactuel">
                        <div className="boite ">Clients</div>
                    </Link>

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
                            Créer Client
                        </button>
                    </div>
                </div>
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {client.map((c) => {
                            return <AfficherClient key={c.id_client} client={c} onEditClick={handleEditClick} />;
                        })}
                    </div>
                </div>
            </div>
            <CreeClient 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onClientCreated={handleClient}
            />
            <ModifierClient 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                onClientModified={handleClient}
                client={selectedClient}
            />
        </div>
    );
}