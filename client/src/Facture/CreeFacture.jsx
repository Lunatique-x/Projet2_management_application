import { useState, useEffect } from "react";

// 1. On crée la fonction utilitaire à l'extérieur (ou à l'intérieur)
    const getFirstMatch = (list, searchTerm) => {
        if (!searchTerm) return null;
        return list.find(item => 
            item.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

export function CreeFacture({ isOpen, onClose, onFactureCreated }) {
    const [formData, setFormData] = useState({
        client_name: "",
        client_id: null,
        employe_name: "",
        employe_id: null,
        voiture_modele: "",
        voiture_id: null,
        prix_vente: 0
    });

    const [allClients, setAllClients] = useState([]);
    const [allEmployes, setAllEmployes] = useState([]);
    const [allVoitures, setAllVoitures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getAllClients();
            getAllEmployees();
            getAllVoitures();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const getAllClients = async () => {
        try {
            const res = await fetch("http://localhost:3000/allClient", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            setAllClients(data);
        }
        } catch (error) {
            console.error("Erreur lors de la récupération des clients:", error);
        }
    };

    const getAllEmployees = async () => {
        try {
            const res = await fetch("http://localhost:3000/allEmploye", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            setAllEmployes(data);
        }
        } catch (error) {
            console.error("Erreur lors de la récupération des clients:", error);
        }
    };

    const getAllVoitures = async () => {
        try {
            const res = await fetch("http://localhost:3000/allVoiture", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            setAllVoitures(data);
        }
        } catch (error) {
            console.error("Erreur lors de la récupération des clients:", error);
        }
    };

    const handleKeyDown = (e, fieldName, dataList) => {
        if (e.key === 'Enter') {
            const searchTerm = (formData[fieldName] || "").toLowerCase();
            
            // On cherche le premier qui correspond à ce qui est écrit
            const match = dataList.find(item => 
                (item.full_name || item.modele || "").toLowerCase().includes(searchTerm)
            );

            if (match) {
                // Empêche la soumission du formulaire
                e.preventDefault(); 
                
                // Remplit le champ avec le nom complet trouvé
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: match.full_name || match.modele
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. On cherche les objets correspondants dans nos listes
        const clientMatch = allClients.find(c => c.full_name === formData.client_name);
        const employeMatch = allEmployes.find(e => e.full_name === formData.employe_name);
        const voitureMatch = allVoitures.find(v => v.modele === formData.voiture_modele);

        console.log("VOiture trouvée:", voitureMatch);

        // 2. Vérification : est-ce que les noms saisis existent vraiment ?
        if (!clientMatch || !employeMatch || !voitureMatch) {
            alert("Erreur : Veuillez sélectionner des noms valides dans les listes suggérées.");
            return;
        }

        setIsLoading(true);

        // 3. On prépare le body avec les IDs et les dates
        const dateGarantie = new Date();
        dateGarantie.setFullYear(dateGarantie.getFullYear() + 1);

        const dataToSend = {
            date_creation: new Date().toISOString(),
            date_fin_garantie: dateGarantie.toISOString(),
            prix_vente: voitureMatch.prix, // On prend le prix de la voiture trouvée
            client_id: clientMatch.id_client,
            employe_id: employeMatch.id_employe,
            voiture_id: voitureMatch.id_voiture
        };

        console.log("Données envoyées au backend:", dataToSend);

        try {
            const res = await fetch("http://localhost:3000/post/payement", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                const data = await res.json();
                onFactureCreated(data);
                // Reset complet du formulaire
                setFormData({
                    client_name: "",
                    client_id: null,
                    employe_name: "",
                    employe_id: null,
                    voiture_modele: "",
                    voiture_id: null,
                    prix_vente: 0
                });
                onClose();
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Créer une nouvelle Facture</p>
                    <button className="delete" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Nom du client</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="client_name"
                                    list="clients-list" // Lie l'input au datalist via l'ID
                                    value={formData.client_name}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'client_name', allClients)}
                                    autoComplete="off"
                                    required
                                />
                                <datalist id="clients-list">
                                    {allClients
                                        .filter(client => 
                                            client.full_name.toLowerCase().includes(formData.client_name.toLowerCase())
                                        )
                                        .slice(0, 3) // Garde seulement les 3 premiers résultats
                                        .map((client) => (
                                            <option key={client.id_client} value={client.full_name} />
                                        ))
                                    }
                                </datalist>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Nom de l'employée</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="employe_name"
                                    list="employes-list" // Lie l'input au datalist via l'ID
                                    value={formData.employe_name}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'employe_name', allEmployes)}
                                    autoComplete="off"
                                    required
                                />
                                <datalist id="employes-list">
                                    {allEmployes
                                        .filter(employe => 
                                            employe.full_name.toLowerCase().includes(formData.employe_name.toLowerCase())
                                        )
                                        .slice(0, 3) // Garde seulement les 3 premiers résultats
                                        .map((employe) => (
                                            <option key={employe.id_employe} value={employe.full_name} />
                                        ))
                                    }
                                </datalist>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Modèle de la Voiture</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="voiture_modele"
                                    list="voitures-list"
                                    value={formData.voiture_modele}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'voiture_modele', allVoitures)} // Appel avec le type 'voiture'
                                    autoComplete="off"
                                    required
                                />
                                <datalist id="voitures-list">
                                    {allVoitures
                                        .filter(v => (v.modele).toLowerCase().includes(formData.voiture_modele.toLowerCase()))
                                        .slice(0, 3)
                                        .map((v) => (
                                            <option key={v.id_voiture} value={v.modele} />
                                        ))
                                    }
                                </datalist>
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot">
                    <button className="button" onClick={onClose}>Annuler</button>
                    <button
                        className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Créer
                    </button>
                </footer>
            </div>
        </div>
    );
}