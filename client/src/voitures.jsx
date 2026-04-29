import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { AfficherVoiture } from "./Voiture/AfficherVoiture";
import { CreeVoiture } from "./Voiture/CreeVoiture";

export function Voiture() {
    const [voitures, setVoitures] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    return (
        <div className="section" style={{
            display: 'flex',
            justifyContent: 'flex-start',
            paddingTop: '100px',
            marginLeft: '25px'
        }}>
            <div className="card-box" style={{ maxWidth: '300px' }}>
                <div className="box">
                    <Link to="/clients" className="link">
                        <div className="boite ">Clients</div>
                    </Link>

                    <Link to="/voitures" className="siteactuel">
                        <div className="boite">Voitures</div>
                    </Link>

                    <Link to="/factures" className="link">
                        <div className="boite">Factures</div>
                    </Link>

                    <Link to="/employes" className="link">
                        <div className="boite">Employés</div>
                    </Link>

                    <Link to="/roles" className="link">
                        <div className="boite">Role</div>
                    </Link>
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
                        {voitures.map((voiture) => {
                            return <AfficherVoiture key={voiture.id_voiture} voiture={voiture} />;
                        })}
                    </div>
                </div>
            </div>

            <CreeVoiture 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onVoitureCreated={handleVoitureCreated}
            />
        </div>
    );
}