import { Link, useNavigate } from "react-router-dom";
import { AfficherFacture } from "./Facture/AfficherFacture";
import { useState, useEffect, useContext } from "react"; // Regroupement des imports React
import { CreeFacture } from "./Facture/CreeFacture";
import { ModifierFacture } from "./Facture/ModifierSupprimerFacture";
import { AuthContext } from "./AuthContext";
import { Pagination } from "./assets/Pagination"; // Import de votre composant Pagination
import { Filter } from "./assets/Filtre"; // Import de votre composant Filter

export function Factures() {
    // useContexte
    const { user } = useContext(AuthContext);
    const [factures, setFactures] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedFacture, setSelectedFacture] = useState(null);

    // État pour la recherche
    const [recherche, setRecherche] = useState("");

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [showsPerPage, setShowsPerPage] = useState(8); // Valeur par défaut de départ (ex: 8)

    if (!user || user.viewSell !== 1) {
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

    const handleFacture = () => {
        getFactures();
    };

    const handleEditClick = (factureToEdit) => {
        if (user?.modSell !== 1) return;
        setSelectedFacture(factureToEdit);
        setIsEditModalOpen(true);
    };

    // Gestion du changement de texte dans la recherche
    const handleRechercheChange = (e) => {
        setRecherche(e.target.value);
        setCurrentPage(1); // Réinitialise à la première page lors d'une recherche
    };

    // Logique de filtrage par nom de client ou nom d'employé
    // Adapter 'nom_client' et 'nom_employe' selon les clés exactes de vos objets JSON
    const facturesFiltrées = factures.filter((f) => {
        const terme = recherche.toLowerCase();
        const nomClient = f.client_nom ? f.client_nom.toLowerCase() : "";
        const nomEmploye = f.employe_nom ? f.employe_nom.toLowerCase() : "";
        const nomVoiture = f.voiture_modele ? f.voiture_modele.toLowerCase() : "";
        
        return nomClient.includes(terme) || nomEmploye.includes(terme) || nomVoiture.includes(terme);
    });

    // Logique de calcul de la pagination sur les éléments filtrés
    const indexOfLastShow = currentPage * showsPerPage;
    const indexOfFirstShow = indexOfLastShow - showsPerPage;
    const currentFactures = facturesFiltrées.slice(indexOfFirstShow, indexOfLastShow);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

                    {user.viewStock === 1 && (
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
                    <Link to="/roles" className="link" >
                        <div className="boite" >Role</div>
                    </Link>
                    </>
                    )}
                </div>
            </div>
            <div className="container">
                <div className="section">
                    {/* Structure avec bouton isolé à gauche et Filtre épuré à sa droite */}
                    <div className="columns is-vcentered is-mobile">
                        <div className="column is-narrow">
                            <button 
                                className="button is-primary"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Créer une Facture
                            </button>
                        </div>
                        <div className="column">
                            <Filter 
                                placeholderText="Rechercher par client ou employé..."
                                rechercheValue={recherche}
                                onRechercheChange={handleRechercheChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {/* Utilisation du tableau filtré et paginé */}
                        {currentFactures.map((f) => {
                            return <AfficherFacture key={f.id_payement} facture={f} onEditClick={handleEditClick} />;
                        })}
                    </div>
                    {/* Le composant de pagination prend désormais en compte la longueur du tableau filtré */}
                    <Pagination 
                        totalShows={facturesFiltrées.length}
                        showsPerPage={showsPerPage}
                        setShowsPerPage={setShowsPerPage}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                </div>
            </div>
            <CreeFacture 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onFactureCreated={handleFacture}
            />
            <ModifierFacture 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)}
                onFactureModified={handleFacture} 
                facture={selectedFacture} 
            />
        </div>
    );
}
