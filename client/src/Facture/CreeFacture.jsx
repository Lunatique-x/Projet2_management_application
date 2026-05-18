import { useState, useEffect } from "react";
import { fetchClients, fetchEmployees, fetchVoitures } from "../api";

export function CreeFacture({ isOpen, onClose, onFactureCreated }) {
    const [formData, setFormData] = useState({
        client_name: "",
        client_id: null,
        client_phone: "",
        employe_name: "",
        employe_id: null,
        voiture_modele: "",
        voiture_id: null,
        voiture_couleur: "",
        prix_vente: 0
    });

    const [allClients, setAllClients] = useState([]);
    const [allEmployes, setAllEmployes] = useState([]);
    const [allVoitures, setAllVoitures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Reset du formulaire à l'ouverture
    useEffect(() => {
        const loadData = async () => {
            const [clients, employees, voitures] = await Promise.all([
                fetchClients(),
                fetchEmployees(),
                fetchVoitures()
            ]);
            setAllClients(clients);
            setAllEmployes(employees);
            setAllVoitures(voitures);
        };
        
        loadData();

        if (isOpen) {
            setFormData({
                client_name: "", client_id: null, client_phone: "",
                employe_name: "", employe_id: null,
                voiture_modele: "", voiture_id: null, voiture_couleur: "",
                prix_vente: 0
            });
        }
    }, [isOpen]);

    // Détection automatique lors de la saisie ou sélection dans le datalist
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            // 1. Liaison automatique Client
            if (name === "client_name") {
                const match = allClients.find(c => c.full_name === value);
                updated.client_id = match ? match.id_client : null;
                updated.client_phone = match ? match.phone : "";
            }

            // 2. Liaison automatique Employé
            if (name === "employe_name") {
                const match = allEmployes.find(e => e.full_name === value);
                updated.employe_id = match ? match.id_employe : null;
            }

            // 3. Liaison automatique Voiture
            if (name === "voiture_modele") {
                // Correspondance basée sur la valeur affichée dans l'option du datalist
                const match = allVoitures.find(v => `${v.modele} - ${v.couleur}` === value);
                updated.voiture_id = match ? match.id_voiture : null;
                updated.voiture_couleur = match ? match.couleur : "";
                updated.prix_vente = match ? match.prix : 0;
            }

            return updated;
        });
    };

    // Gestion de la recherche par autocomplétion avec la touche "Entrée"
    const handleKeyDown = (e, fieldName, dataList) => {
        if (e.key === 'Enter') {
            const searchTerm = (formData[fieldName] || "").toLowerCase();
            
            const match = dataList.find(item => {
                const textToSearch = item.full_name || item.modele || "";
                return textToSearch.toLowerCase().includes(searchTerm);
            });

            if (match) {
                e.preventDefault(); 
                
                setFormData(prev => {
                    if (fieldName === 'client_name') {
                        return {
                            ...prev,
                            client_name: match.full_name,
                            client_id: match.id_client,
                            client_phone: match.phone
                        };
                    }
                    if (fieldName === 'employe_name') {
                        return {
                            ...prev,
                            employe_name: match.full_name,
                            employe_id: match.id_employe
                        };
                    }
                    if (fieldName === 'voiture_modele') {
                        return {
                            ...prev,
                            voiture_modele: `${match.modele} - ${match.couleur}`,
                            voiture_id: match.id_voiture,
                            voiture_couleur: match.couleur,
                            prix_vente: match.prix
                        };
                    }
                    return prev;
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Plus besoin de chercher les correspondances ici, tout est déjà dans formData !
        if (!formData.client_id || !formData.employe_id || !formData.voiture_id) {
            alert("Erreur : Veuillez sélectionner des éléments valides dans les listes.");
            return;
        }

        // Vérification du stock via l'ID trouvé
        const voitureSelectionnee = allVoitures.find(v => v.id_voiture === formData.voiture_id);
        if (voitureSelectionnee && voitureSelectionnee.stock <= 0) {
            alert("Impossible de vendre : ce véhicule est en rupture de stock.");
            return;
        }

        setIsLoading(true);

        const dateGarantie = new Date();
        dateGarantie.setFullYear(dateGarantie.getFullYear() + 1);

        const dataToSend = {
            date_creation: new Date().toISOString(),
            date_fin_garantie: dateGarantie.toISOString(),
            prix_vente: formData.prix_vente,
            client_id: formData.client_id,
            employe_id: formData.employe_id,
            voiture_id: formData.voiture_id
        };

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
                    <button className="delete" onClick={onClose} type="button"></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleSubmit}>
                        
                        {/* CHAMP : CLIENT */}
                        <div className="field">
                            <label className="label">Nom du client</label>
                            <div className="control">
                                <input
                                    className="input"
                                    name="client_name"
                                    list="clients-list"
                                    value={formData.client_name}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'client_name', allClients)}
                                    autoComplete="off"
                                    required
                                />
                                <datalist id="clients-list">
                                    {allClients.map(c => (
                                        <option key={c.id_client} value={c.full_name}>{c.phone}</option>
                                    ))}
                                </datalist>
                                {formData.client_phone && (
                                    <p className="help is-info">Téléphone lié : {formData.client_phone}</p>
                                )}
                            </div>
                        </div>

                        {/* CHAMP : EMPLOYÉ */}
                        <div className="field">
                            <label className="label">Nom de l'employé(e)</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="employe_name"
                                    list="employes-list"
                                    value={formData.employe_name}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'employe_name', allEmployes)}
                                    autoComplete="off"
                                    required
                                />
                                <datalist id="employes-list">
                                    {allEmployes.map(e => (
                                        <option key={e.id_employe} value={e.full_name} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        {/* CHAMP : VOITURE */}
                        <div className="field">
                            <label className="label">Modèle de Voiture</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="voiture_modele"
                                    list="voitures-list"
                                    value={formData.voiture_modele}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'voiture_modele', allVoitures)}
                                    autoComplete="off"
                                    required
                                />
                                <datalist id="voitures-list">
                                    {allVoitures.map(v => (
                                        <option key={v.id_voiture} value={`${v.modele} - ${v.couleur}`}>
                                            Stock: {v.stock} - {v.prix}$
                                        </option>
                                    ))}
                                </datalist>
                                {formData.voiture_couleur && (
                                    <p className="help is-success">Couleur: {formData.voiture_couleur} | Prix: {formData.prix_vente}$</p>
                                )}
                            </div>
                        </div>

                        <div className="field is-grouped is-grouped mt-5">
                            <div className="control">
                                <button 
                                    className={`button is-primary ${isLoading ? 'is-loading' : ''}`} 
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    Créer la facture
                                </button>
                            </div>
                            <div className="control">
                                <button 
                                    className="button is-white" 
                                    type="button" 
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}
