import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react"; // Regroupement des imports React
import { AfficherClient } from "./AfficherClient";
import { CreeClient } from "./CreeClient";
import { ModifierClient } from "./ModifierSupprimerClient";
import { Pagination } from "../assets/Pagination"; // Assurez-vous que le chemin vers votre composant est correct
import { AuthContext } from "../Securite/authContext";
import { Filter } from "../assets/Filtre"; // Import de votre nouveau composant Filter

export function Clients() {
    const { user } = useContext(AuthContext);
    const [client, setClient] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [recherche, setRecherche] = useState("");

    // --- ÉTATS REQUIS POUR VOTRE COMPOSANT PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);
    const [clientsPerPage, setClientsPerPage] = useState(8); // Aligné sur vos valeurs (4, 8, 12, 16)

    if (!user || user.viewClients !== 1) {
        return <div className="section">Accès refusé : vous n'avez pas la permission de voir les clients.</div>;
    }

    // 1. Filtrage initial par chaîne de recherche
    const filteredClients = (client || []).filter((c) =>
        c.full_name && c.full_name.toLowerCase().includes(recherche.toLowerCase())
    );

    // 2. Calcul des index de découpage basés sur vos variables d'état
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    useEffect(() => {
        getClient();
    }, []);

    // Réinitialisation automatique de la page active à 1 lors d'une saisie de recherche
    const handleRechercheChange = (e) => {
        setRecherche(e.target.value);
        setCurrentPage(1);
    };

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
                    {/* Alignement horizontal du bouton et du filtre côte à côte */}
                    <div className="columns is-vcentered is-mobile">
                        {user.addClient === 1 && (
                        <div className="column is-narrow">
                            <button
                                className="button is-primary"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Créer Client
                            </button>
                        </div>
                        )}
                        {/* Le filtre avec ses 3 propriétés épurées */}
                        <div className="column">
                            <Filter 
                                placeholderText="Rechercher un client par nom..."
                                rechercheValue={recherche}
                                onRechercheChange={handleRechercheChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="section">
                    {/* Utilisation de la liste découpée (currentClients) */}
                    <div className="row columns is-multiline is-mobile">
                        {currentClients.map((c) => {
                            return <AfficherClient key={c.id_client} client={c} onEditClick={handleEditClick} />;
                        })}
                    </div>

                    {/* Inclusion de votre composant de pagination personnalisé */}
                    <Pagination 
                        totalShows={filteredClients.length} 
                        showsPerPage={clientsPerPage} 
                        setShowsPerPage={setClientsPerPage}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                    />
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
