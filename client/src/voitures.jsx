import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AfficherVoiture } from "./Voiture/AfficherVoiture";
import { CreeVoiture } from "./Voiture/CreeVoiture";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function Voiture() {
    const { user } = useContext(AuthContext);

    const [voitures, setVoitures] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const voituresPerPage = 8;

    if (!user || user.seeStock !== 1) {
        return <div className="section">Accès refusé : vous n'avez pas la permission de voir les facutures.</div>;
    }

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
        const res = fetch("http://localhost:3000/allVoiture", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        }).then(res => res.json()).then(data => setVoitures(data));
    };

    const totalPages = Math.ceil(voitures.length / voituresPerPage);
    const startIndex = (currentPage - 1) * voituresPerPage;
    const currentVoitures = voitures.slice(startIndex, startIndex + voituresPerPage);

    useEffect(() => {
        if (totalPages > 0 && currentPage > totalPages) {
            setCurrentPage(totalPages);
        }

        if (totalPages === 0 && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

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

                    <Link to="/voitures" className="siteactuel">
                        <div className="boite">Voitures</div>
                    </Link>
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

                            <Link to="/roles" className="link">
                                <div className="boite">Role</div>
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
                            Ajouter une voiture
                        </button>
                    </div>
                </div>
                <div className="section">
                    <div className="row columns is-multiline is-mobile">
                        {currentVoitures.map((voiture) => {
                            return <AfficherVoiture key={voiture.id_voiture} voiture={voiture} />;
                        })}
                    </div>
                </div>

                {totalPages > 1 && (
                    <div className="section" style={{ display: 'flex', justifyContent: 'center' }}>
                        <nav className="pagination" role="navigation" aria-label="pagination">
                            <button
                                className="pagination-previous"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Précédent
                            </button>
                            <button
                                className="pagination-next"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Suivant
                            </button>
                            <ul className="pagination-list">
                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                    <li key={page}>
                                        <button
                                            className={`pagination-link ${currentPage === page ? 'is-current' : ''}`}
                                            aria-label={`Page ${page}`}
                                            aria-current={currentPage === page ? 'page' : undefined}
                                            onClick={() => setCurrentPage(page)}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            <CreeVoiture
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onVoitureCreated={handleVoitureCreated}
            />
        </div>
    );
}