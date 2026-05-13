import { useState, useEffect } from "react";
// Importation de toutes les fonctions nécessaires
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { 
    fetchClients, 
    fetchEmployees, 
    fetchVoitures, 
    updateFacture, 
    deleteFacture 
} from "../api";

export function ModifierFacture({ isOpen, onClose, onFactureModified, facture }) {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        client_name: "",
        employe_name: "",
        voiture_modele: "",
        prix_vente: 0
    });

    const [allClients, setAllClients] = useState([]);
    const [allEmployes, setAllEmployes] = useState([]);
    const [allVoitures, setAllVoitures] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const selectedVoiture = allVoitures.find(v => `${v.modele} (${v.couleur})` === formData.voiture_modele);
    const selectedClient = allClients.find(c => c.full_name === formData.client_name);
    // Optionnel : trouver l'employé sélectionné pour afficher des infos si besoin
    const selectedEmploye = allEmployes.find(e => e.full_name === formData.employe_name);
    
    const isOutOfStock = selectedVoiture && selectedVoiture.stock <= 0;

    useEffect(() => {
        if (isOpen) {
            refreshData();
            if (facture) {
                setFormData({
                    client_name: facture.client_name || "",
                    employe_name: facture.employe_name || "",
                    voiture_modele: facture.modele ? `${facture.modele} (${facture.couleur})` : "",
                    prix_vente: facture.prix_vente || 0
                });
            }
        }
    }, [isOpen, facture]);

    const refreshData = async () => {
        setAllClients(await fetchClients());
        setAllEmployes(await fetchEmployees());
        setAllVoitures(await fetchVoitures());
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleKeyDown = (e, fieldName, dataList) => {
        if (e.key === 'Enter') {
            const searchTerm = (formData[fieldName] || "").toLowerCase();
            const match = dataList.find(item => 
                (item.full_name || item.modele || "").toLowerCase().includes(searchTerm)
            );
            if (match) {
                e.preventDefault(); 
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: match.full_name || `${match.modele} (${match.couleur})`
                }));
            }
        }
    };

    const handleUpdate = async (e) => {
        if (e) e.preventDefault();
        
        const clientMatch = allClients.find(c => c.full_name === formData.client_name);
        const employeMatch = allEmployes.find(e => e.full_name === formData.employe_name);
        const voitureMatch = allVoitures.find(v => `${v.modele} (${v.couleur})` === formData.voiture_modele);

        if (!clientMatch || !employeMatch || !voitureMatch) {
            alert("Erreur : Veuillez sélectionner des éléments valides.");
            return;
        }

        setIsLoading(true);
        const res = await updateFacture(facture.id_payement, {
            client_id: clientMatch.id_client,
            employe_id: employeMatch.id_employe,
            voiture_id: voitureMatch.id_voiture,
            prix_vente: formData.prix_vente
        });

        if (res.ok) {
            onFactureModified();
            onClose();
        }
        setIsLoading(false);
    };

    const handleSuppress = async () => {
        if (!window.confirm("Supprimer cette facture ? (Le stock sera rendu)")) return;
        
        setIsLoading(true);
        const res = await deleteFacture(facture.id_payement);
        
        if (res.ok) {
            onFactureModified();
            onClose();
        }
        setIsLoading(false);
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
                            <input className="input" name="client_name" list="edit-clients" value={formData.client_name} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'client_name', allClients)} required />
                            <datalist id="edit-clients">
                                {allClients.map(c => <option key={c.id_client} value={c.full_name}>{c.phone}</option>)}
                            </datalist>
                            {selectedClient && <p className="help is-info">Tel: {selectedClient.phone}</p>}
                        </div>

                        {/* CHAMP EMPLOYÉ (AJOUTÉ) */}
                        <div className="field">
                            <label className="label">Employé (Vendeur)</label>
                            <input className="input" name="employe_name" list="edit-employes" value={formData.employe_name} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'employe_name', allEmployes)} required />
                            <datalist id="edit-employes">
                                {allEmployes.map(e => <option key={e.id_employe} value={e.full_name}>{e.email}</option>)}
                            </datalist>
                        </div>

                        {/* CHAMP VOITURE */}
                        <div className="field">
                            <label className="label">Voiture</label>
                            <input className={`input ${isOutOfStock ? 'is-danger' : ''}`} name="voiture_modele" list="edit-voitures" value={formData.voiture_modele} onChange={handleChange} onKeyDown={(e) => handleKeyDown(e, 'voiture_modele', allVoitures)} required />
                            <datalist id="edit-voitures">
                                {allVoitures.map(v => <option key={v.id_voiture} value={`${v.modele} (${v.couleur})`}>Stock: {v.stock}</option>)}
                            </datalist>
                            {selectedVoiture && (
                                <div className="mt-1">
                                    <p className="help is-info">Couleur: {selectedVoiture.couleur}</p>
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
                    <button className={`button is-warning ${isLoading ? 'is-loading' : ''}`} onClick={handleUpdate} disabled={isOutOfStock || isLoading}>Modifier</button>
                    {user.delSell === "1" && (
                    <button className={`button is-danger ${isLoading ? 'is-loading' : ''}`} onClick={handleSuppress} disabled={isLoading}>Supprimer</button>
                    )}
                    <button className="button" type="button" onClick={onClose}>Annuler</button>
                </footer>
            </div>
        </div>
    );
}
