import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import { AfficherRole } from "./Role/AfficherRole";
import { CreeRole } from "./Role/CreeRole";
import { ModifierRole } from "./Role/ModifierRole";
import { Pagination } from "./assets/Pagination";
import { Filter } from "./assets/Filtre"; // Import de votre composant Filter

export function Roles() { 
    // ajout du use contexte
    const { user } = useContext(AuthContext);
    const [roles, setRoles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    // État pour la recherche
    const [recherche, setRecherche] = useState("");

    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [showsPerPage, setShowsPerPage] = useState(8);

    useEffect(() => {
        getRole();
    }, []);

    async function getRole() {
        const res = await fetch("http://localhost:3000/allRole", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            setRoles(data);
        }
    }

    const handleRoleCreated = () => {
        getRole();
    };

    const handleEditClick = (roleToEdit) => {
        setSelectedRole(roleToEdit);
        setIsEditModalOpen(true);
    };

    const handleRoleModified = () => {
        getRole();
    };

    // Gestion du changement de texte dans la recherche
    const handleRechercheChange = (e) => {
        setRecherche(e.target.value);
        setCurrentPage(1); // Force le retour à la première page lors de la saisie
    };

    if (!user || user.role_name !== "admin") {
        return (
            <div className="section">
                <h1 className="title is-4">Accès refusé</h1>
                <p>Vous n'avez pas les permissions nécessaires pour gérer les roles.</p>
                <Link to="/home">Retour à l'accueil</Link>
            </div>
        );
    }

    // Logique de filtrage par nom de rôle
    const rolesFiltrés = roles.filter((r) => {
        const terme = recherche.toLowerCase();
        const nomRole = r.nom ? r.nom.toLowerCase() : "";
        return nomRole.includes(terme);
    });

    // Logique de calcul de la pagination sur le tableau filtré
    const indexOfLastShow = currentPage * showsPerPage;
    const indexOfFirstShow = indexOfLastShow - showsPerPage;
    const currentRoles = rolesFiltrés.slice(indexOfFirstShow, indexOfLastShow);

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

                    <Link to="/employes" className="link">
                        <div className="boite">Employés</div>
                    </Link>
                    <Link to="/roles" className="siteactuel" >
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
                                Créer un rôle
                            </button>
                        </div>
                        <div className="column">
                            <Filter 
                                placeholderText="Rechercher un rôle..."
                                rechercheValue={recherche}
                                onRechercheChange={handleRechercheChange}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {currentRoles.map((role) => {
                            return <AfficherRole key={role.id_role} role={role} onEditClick={handleEditClick} />;
                        })}
                    </div>
                    {/* Le composant de pagination s'appuie désormais sur la liste filtrée */}
                    <Pagination 
                        totalShows={rolesFiltrés.length}
                        showsPerPage={showsPerPage}
                        setShowsPerPage={setShowsPerPage}
                        currentPage={currentPage}
                        paginate={paginate}
                    />
                </div>
            </div>

            <CreeRole 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onRoleCreated={handleRoleCreated}
            />

            <ModifierRole
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onRoleModified={handleRoleModified}
                role={selectedRole}
            />
        </div>
    );
}
