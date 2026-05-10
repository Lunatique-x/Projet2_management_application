import { useState, useEffect } from "react";
import { fetchClients, fetchEmployees, fetchVoitures } from "../api";

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
        client_phone: "", // Ajouté
        employe_name: "",
        employe_id: null,
        voiture_modele: "",
        voiture_id: null,
        voiture_couleur: "", // Ajouté
        prix_vente: 0
    });

    const [allClients, setAllClients] = useState([]);
    const [allEmployes, setAllEmployes] = useState([]);
    const [allVoitures, setAllVoitures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const selectedVoiture = allVoitures.find(v => `${v.modele} (${v.couleur})` === formData.voiture_modele);
    const selectedClient = allClients.find(c => c.full_name === formData.client_name);
    const isOutOfStock = selectedVoiture && selectedVoiture.stock <= 0;

    useEffect(() => {
        if (isOpen) {
            getAllClients();
            getAllEmployees();
            getAllVoitures();

            setFormData({
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
            console.log(allVoitures)
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
        const data = await fetchClients();
        setAllClients(data);
    };

    const getAllEmployees = async () => {
        const data = await fetchEmployees();
        setAllEmployes(data);
    };

    const getAllVoitures = async () => {
        const data = await fetchVoitures();
        setAllVoitures(data);
    };

    const handleKeyDown = (e, fieldName, dataList) => {
        if (e.key === 'Enter') {
            const searchTerm = (formData[fieldName] || "").toLowerCase();
            
            const match = dataList.find(item => 
                (item.full_name || item.modele || "").toLowerCase().includes(searchTerm)
            );

            if (match) {
                e.preventDefault(); 
                
                // On met à jour le nom ET les infos supplémentaires (tel ou couleur)
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: match.full_name || match.modele,
                    client_phone: match.phone ? match.phone : prev.client_phone,
                    voiture_couleur: match.couleur ? match.couleur : prev.voiture_couleur
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const clientMatch = allClients.find(c => c.full_name === formData.client_name);
        const employeMatch = allEmployes.find(e => e.full_name === formData.employe_name);
        const voitureMatch = allVoitures.find(v => `${v.modele} - ${v.couleur}` === formData.voiture_modele);

        if (voitureMatch && voitureMatch.stock <= 0) {
            alert("Impossible de vendre : ce véhicule est en rupture de stock.");
            return;
        }

        if (!clientMatch || !employeMatch || !voitureMatch) {
            alert("Erreur : Veuillez sélectionner des éléments valides.");
            return;
        }

        setIsLoading(true);

        const dateGarantie = new Date();
        dateGarantie.setFullYear(dateGarantie.getFullYear() + 1);

        const dataToSend = {
            date_creation: new Date().toISOString(),
            date_fin_garantie: dateGarantie.toISOString(),
            prix_vente: voitureMatch.prix,
            client_id: clientMatch.id_client,
            employe_id: employeMatch.id_employe,
            voiture_id: voitureMatch.id_voiture
            // Note: Le téléphone et la couleur ne sont pas dans ta table 'payement' 
            // d'après ton db.js, donc on ne les envoie pas, on les affiche juste.
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
                setFormData({
                    client_name: "", client_id: null, client_phone: "",
                    employe_name: "", employe_id: null,
                    voiture_modele: "", voiture_id: null, voiture_couleur: "",
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
                                    name="client_name"
                                    list="clients-list"
                                    value={formData.client_name}
                                    onChange={handleChange}
                                    onKeyDown={(e) => handleKeyDown(e, 'client_name', allClients)}
                                    required
                                />
                                <datalist id="clients-list">
                                    {allClients.map(c => (
                                        <option key={c.id_client} value={c.full_name}>{c.phone}</option>
                                    ))}
                                </datalist>
                                {selectedClient && (
                                <p className="help is-info">Téléphone : {selectedClient.phone}</p>
                                )}
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
                                    className={`input ${isOutOfStock ? 'is-danger' : ''}`}
                                    name="voiture_modele"
                                    list="voitures-list"
                                    value={formData.voiture_modele}
                                    onChange={handleChange}
                                    required
                                />
                                <datalist id="voitures-list">
                                    {allVoitures.map(v => (
                                        <option key={v.id_voiture} value={`${v.modele} (${v.couleur})`}>Stock: {v.stock} | {v.couleur}</option>
                                    ))}
                                </datalist>
                            </div>
                            {selectedVoiture && (
                                <div className="mt-2">
                                    <p className="help is-info">Couleur : {selectedVoiture.couleur}</p>
                                    {isOutOfStock ? (
                                        <p className="help is-danger has-text-weight-bold">
                                            ⚠️ Ce véhicule est en rupture de stock.
                                        </p>
                                    ) : (
                                        <p className="help is-success">Stock disponible : {selectedVoiture.stock}</p>
                                    )}
                                </div>
                            )}
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