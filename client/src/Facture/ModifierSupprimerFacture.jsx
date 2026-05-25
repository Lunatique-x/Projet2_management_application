import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../Securite/authContext";
import { 
    fetchClients, 
    fetchEmployees, 
    fetchVoitures, 
    updateFacture, 
    deleteFacture 
} from "../Api/api";

export function ModifierFacture({ isOpen, onClose, onFactureModified, facture }) {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        client_name: "",
        client_id: null,
        client_email: "",
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

    // Détection en temps réel basée directement sur les IDs présents dans le formData
    const selectedVoiture = allVoitures.find(v => v.id_voiture === formData.voiture_id);
    const isOutOfStock = selectedVoiture && selectedVoiture.stock <= 0;

    useEffect(() => {
        const refreshData = async () => {
            const [clients, employees, voitures] = await Promise.all([
                fetchClients(),
                fetchEmployees(),
                fetchVoitures()
            ]);
            setAllClients(clients);
            setAllEmployes(employees);
            setAllVoitures(voitures);

            // Liaison des métadonnées dès que les listes de référence API sont chargées
            if (facture) {
                const clientMatch = clients.find(c => c.id_client === facture.client_id || c.full_name === facture.client_nom);
                const voitureMatch = voitures.find(v => v.id_voiture === facture.voiture_id || `${v.modele} (${v.couleur})` === facture.voiture_modele);
                
                setFormData({
                    client_name: facture.client_nom || facture.client_name || "",
                    client_id: facture.client_id || (clientMatch ? clientMatch.id_client : null),
                    client_email: facture.client_email || (clientMatch ? clientMatch.email : ""),
                    employe_name: facture.employe_nom || facture.employe_name || "",
                    employe_id: facture.employe_id || null,
                    voiture_modele: facture.voiture_modele || (voitureMatch ? `${voitureMatch.modele} (${voitureMatch.couleur})` : ""),
                    voiture_id: facture.voiture_id || (voitureMatch ? voitureMatch.id_voiture : null),
                    voiture_couleur: facture.voiture_couleur || (voitureMatch ? voitureMatch.couleur : ""),
                    prix_vente: facture.prix_vente || 0
                });
            }
        };

        if (isOpen) {
            refreshData();
        }
    }, [isOpen, facture]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const updated = { ...prev, [name]: value };

            if (name === "client_name") {
                const match = allClients.find(c => c.full_name === value);
                updated.client_id = match ? match.id_client : null;
                updated.client_email = match ? match.email : "";
            }
            if (name === "employe_name") {
                const match = allEmployes.find(e => e.full_name === value);
                updated.employe_id = match ? match.id_employe : null;
            }
            if (name === "voiture_modele") {
                const match = allVoitures.find(v => `${v.modele} (${v.couleur})` === value);
                updated.voiture_id = match ? match.id_voiture : null;
                updated.voiture_couleur = match ? match.couleur : "";
            }
            return updated;
        });
    };

    const handleKeyDown = (e, fieldName, dataList) => {
        if (e.key === 'Enter') {
            const searchTerm = (formData[fieldName] || "").toLowerCase();
            const match = dataList.find(item => 
                (item.full_name || item.modele || "").toLowerCase().includes(searchTerm)
            );
            if (match) {
                e.preventDefault(); 
                setFormData(prev => {
                    if (fieldName === 'client_name') {
                        return { ...prev, client_name: match.full_name, client_id: match.id_client, client_email: match.email };
                    }
                    if (fieldName === 'employe_name') {
                        return { ...prev, employe_name: match.full_name, employe_id: match.id_employe };
                    }
                    if (fieldName === 'voiture_modele') {
                        return { ...prev, voiture_modele: `${match.modele} (${match.couleur})`, voiture_id: match.id_voiture, voiture_couleur: match.couleur };
                    }
                    return prev;
                });
            }
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        
        if (!formData.client_id || !formData.employe_id || !formData.voiture_id) {
            alert("Erreur : Veuillez sélectionner des éléments valides dans les listes.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await updateFacture(facture.id_payement, {
                client_id: formData.client_id,
                employe_id: formData.employe_id,
                voiture_id: formData.voiture_id,
                prix_vente: Number(formData.prix_vente)
            });

            if (res && res.ok) {
                onFactureModified();
                onClose();
            }
        } catch (error) {
            console.error("Erreur de modification:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuppress = async () => {
        if (!window.confirm("Supprimer cette facture ? (Le stock sera rendu)")) return;
        
        setIsLoading(true);
        try {
            const res = await deleteFacture(facture.id_payement);
            if (res && res.ok) {
                onFactureModified();
                onClose();
            }
        } catch (error) {
            console.error("Erreur de suppression:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modifier Facture #{facture?.id_payement}</p>
                    <button className="delete" type="button" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <form id="edit-facture-form" onSubmit={handleUpdate}>
                        
                        {/* CHAMP CLIENT */}
                        <div className="field">
                            <label className="label">Client</label>
                            <input className="input" name="client_name" list="edit-clients" value={formData.client_name} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'client_name', allClients)} autoComplete="off" required />
                            <datalist id="edit-clients">
                                {allClients.map(c => <option key={c.id_client} value={c.full_name}>{c.email}</option>)}
                            </datalist>
                            {formData.client_email && <p className="help is-info">Email: {formData.client_email}</p>}
                        </div>

                        {/* CHAMP EMPLOYÉ */}
                        <div className="field">
                            <label className="label">Employé (Vendeur)</label>
                            <input className="input" name="employe_name" list="edit-employes" value={formData.employe_name} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'employe_name', allEmployes)} autoComplete="off" required />
                            <datalist id="edit-employes">
                                {allEmployes.map(e => <option key={e.id_employe} value={e.full_name}>{e.email}</option>)}
                            </datalist>
                        </div>

                        {/* CHAMP VOITURE */}
                        <div className="field">
                            <label className="label">Voiture</label>
                            <input className={`input ${isOutOfStock ? 'is-danger' : ''}`} name="voiture_modele" list="edit-voitures" value={formData.voiture_modele} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'voiture_modele', allVoitures)} autoComplete="off" required />
                            <datalist id="edit-voitures">
                                {allVoitures.map(v => <option key={v.id_voiture} value={`${v.modele} (${v.couleur})`}>Stock: {v.stock}</option>)}
                            </datalist>
                            {formData.voiture_couleur && (
                                <div className="mt-1">
                                    <p className="help is-info">Couleur: {formData.voiture_couleur}</p>
                                    {isOutOfStock && <p className="help is-danger">⚠️ Rupture de stock</p>}
                                </div>
                            )}
                        </div>

                        {/* CHAMP PRIX */}
                        <div className="field">
                            <label className="label">Prix de vente ($)</label>
                            <input className="input" type="number" name="prix_vente" value={formData.prix_vente} onChange={handleChange} required />
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot">
                    <button form="edit-facture-form" type="submit" className={`button is-warning ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>Modifier</button>
                    {user?.delSell === 1 && (
                        <button type="button" className={`button is-danger ${isLoading ? 'is-loading' : ''}`} onClick={handleSuppress} disabled={isLoading}>Supprimer</button>
                    )}
                    <button className="button is-white" type="button" onClick={onClose} disabled={isLoading}>Annuler</button>
                </footer>
            </div>
        </div>
    );
}
