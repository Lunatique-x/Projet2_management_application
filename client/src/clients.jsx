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
    const [recherche, setRecherche] = useState("");

    if (!user || user.viewClients !== 1) {
        return <div className="section">Accès refusé : vous n'avez pas la permission de voir les clients.</div>;
    }
    const filteredClients = (client || []).filter((c) =>
        c.full_name && c.full_name.toLowerCase().includes(recherche.toLowerCase())
    );

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
        if (user?.modClients !== 1) return;
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
                            <Link to="/roles" className="link" >
                                <div className="boite" >Role</div>
                            </Link>
                        </>
                    )}

                </div>
            </div>
            <div className="container">
                <div className="section">
                    <div className="columns is-vcentered is-mobile">
                        <div className="column is-narrow">
                            <button
                                className="button is-primary"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Créer Client
                            </button>
                        </div>

                        <div className="column is-4 ">
                            <div className="control has-icons-left">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="Rechercher un client par nom..."
                                    value={recherche}
                                    onChange={(e) => setRecherche(e.target.value)}
                                />
                                <span className="icon is-left">
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {filteredClients.map((c) => {
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