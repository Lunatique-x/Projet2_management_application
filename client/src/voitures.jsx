import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react"; // Regroupement des imports React
import { AfficherVoiture } from "./Voiture/AfficherVoiture";
import { CreeVoiture } from "./Voiture/CreeVoiture";
import { ModifierVoiture } from "./Voiture/ModifierVoiture";
import { AuthContext } from "./AuthContext";
import { Pagination } from "./assets/Pagination";
import { Filter } from "./assets/Filtre";

export function Voiture() {
    const { user } = useContext(AuthContext);

    const [voitures, setVoitures] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedVoiture, setSelectedVoiture] = useState(null);
    const [recherche, setRecherche] = useState("");

    // --- ÉTATS REQUIS POUR VOTRE COMPOSANT PAGINATION ---
    const [currentPage, setCurrentPage] = useState(1);
    const [voituresPerPage, setVoituresPerPage] = useState(8); 

    if (!user || user.viewStock !== 1) {
        return <div className="section">Accès refusé : vous n'avez pas la permission de voir le stock.</div>;
    }

    // 1. Filtrage par chaîne de recherche (Modèle ou Marque)
    // Ajustez 'c.marque' selon le nom exact de la clé retournée par votre API
    const filteredVoitures = (voitures || []).filter((c) => {
        const terme = recherche.toLowerCase();
        const modeleVoiture = c.modele ? c.modele.toLowerCase() : "";
        const marqueVoiture = c.marque ? c.marque.toLowerCase() : "";
        
        return modeleVoiture.includes(terme) || marqueVoiture.includes(terme);
    });

    // 2. Calcul des index de découpage basés sur vos variables d'état
    const indexOfLastVoiture = currentPage * voituresPerPage;
    const indexOfFirstVoitures = indexOfLastVoiture - voituresPerPage;
    const currentVoitures = filteredVoitures.slice(indexOfFirstVoitures, indexOfLastVoiture);

    // Réinitialisation de la page active à 1 lors d'une nouvelle recherche
    const handleRechercheChange = (e) => {
        setRecherche(e.target.value);
        setCurrentPage(1);
    };

    useEffect(() => {
        async function getVoitures() {
            const res = await fetch("http://localhost:3000/allVoiture", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                const data = await res.json();
                setVoitures(data);
            }
        }

        getVoitures();
    }, []);

    const handleVoitureCreated = () => {
        fetch("http://localhost:3000/allVoiture", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(data => setVoitures(data));
    };

    const handleEditClick = (voitureToEdit) => {
        if (user?.modStock !== 1) return;
        setSelectedVoiture(voitureToEdit);
        setIsEditModalOpen(true);
    };

    const handleVoitureModified = () => {
        fetch("http://localhost:3000/allVoiture", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(data => setVoitures(data));
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
                    {user.viewClients === 1 && (
                        <Link to="/clients" className="link">
                            <div className="boite ">Clients</div>
                        </Link>
                    )}

                    <Link to="/voitures" className="siteactuel">
                        <div className="boite">Voitures</div>
                    </Link>
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

            <div className="container">
                <div className="section">
                    {/* Agencement côte à côte : bouton isolé à gauche et Filtre épuré à sa droite */}
                    <div className="columns is-vcentered is-mobile">
                        {user.addStock === 1 && (
                        <div className="column is-narrow">
                            <button 
                                className="button is-primary"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Ajouter une voiture
                            </button>
                        </div>
                        )}
                        <div className="column">
                            <Filter 
                                placeholderText="Rechercher par modèle ou marque..."
                                rechercheValue={recherche}
                                onRechercheChange={handleRechercheChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {currentVoitures.map((voiture) => {
                            return <AfficherVoiture key={voiture.id_voiture} voiture={voiture} onEditClick={handleEditClick} />;
                        })}
                    </div>
                    <Pagination 
                        totalShows={filteredVoitures.length} 
                        showsPerPage={voituresPerPage} 
                        setShowsPerPage={setVoituresPerPage}
                        currentPage={currentPage}
                        paginate={setCurrentPage}
                    />
                </div>
            </div>

            <CreeVoiture
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVoitureCreated={handleVoitureCreated}
            />
            <ModifierVoiture
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onVoitureModified={handleVoitureModified}
                voiture={selectedVoiture}
            />
        </div>
    );
}
