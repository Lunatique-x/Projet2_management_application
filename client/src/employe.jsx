import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react"; // Regroupement des imports React
import { AfficherEmploye } from "./AfficherEmploye";
import { CreeEmploye } from "./CreeEmploye";
import { ModifierEmploye } from "./ModifierEmploye";
import { AuthContext } from "./AuthContext";
import { Pagination } from "./assets/Pagination"; // Import de votre composant Pagination
import { Filter } from "./assets/Filtre"; // Import de votre composant Filter

export function Employe() {
    // useContexte
    const { user } = useContext(AuthContext);
    const [employes, setEmployes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmploye, setSelectedEmploye] = useState(null);

    // État pour la recherche
    const [recherche, setRecherche] = useState("");

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [showsPerPage, setShowsPerPage] = useState(8); // Valeur par défaut identique à vos factures

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
        getEmployes();
    }, []);

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

    const handleEmployeCreated = () => {
        getEmployes();
    };

    const handleEditClick = (employeToEdit) => {
        setSelectedEmploye(employeToEdit);
        setIsEditModalOpen(true);
    };

    const handleEmployeModified = () => {
        getEmployes();
    };

    // Gestion du changement de texte dans la recherche
    const handleRechercheChange = (e) => {
        setRecherche(e.target.value);
        setCurrentPage(1); // Force le retour à la première page lors de la saisie
    };

    // Logique de filtrage par nom ou prénom
    const employesFiltrés = employes.filter((emp) => {
        const terme = recherche.toLowerCase();
        const nomEmploye = emp.full_name ? emp.full_name.toLowerCase() : "";
        
        return nomEmploye.includes(terme);
    });

    // Logique de calcul de la pagination sur le tableau filtré
    const indexOfLastShow = currentPage * showsPerPage;
    const indexOfFirstShow = indexOfLastShow - showsPerPage;
    const currentEmployes = employesFiltrés.slice(indexOfFirstShow, indexOfLastShow);

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
                    {user.viewSell === 1 && (
                    <Link to="/factures" className="link">
                        <div className="boite">Factures</div>
                    </Link>
                    )}

                    <Link to="/employes" className="siteactuel">
                        <div className="boite">Employés</div>
                    </Link>
                    <Link to="/roles" className="link" >
                        <div className="boite" >Role</div>
                    </Link>
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
                                Ajouter un employé
                            </button>
                        </div>
                        <div className="column">
                            <Filter 
                                placeholderText="Rechercher par nom ou prénom..."
                                rechercheValue={recherche}
                                onRechercheChange={handleRechercheChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {/* Utilisation du tableau filtré et découpé */}
                        {currentEmployes.map((employe) => {
                            return <AfficherEmploye key={employe.id_employe} employe={employe} onEditClick={handleEditClick} />;
                        })}
                    </div>

                    {/* Le total prend en compte le nombre d'éléments après filtrage */}
                    <Pagination 
                        totalShows={employesFiltrés.length}
                        showsPerPage={showsPerPage}
                        setShowsPerPage={setShowsPerPage}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                </div>
            </div>

            <CreeEmploye 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onEmployeCreated={handleEmployeCreated}
            />
            <ModifierEmploye
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onEmployeModified={handleEmployeModified}
                employe={selectedEmploye}
            />
        </div>
    );
}
