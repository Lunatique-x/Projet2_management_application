import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../Securite/authContext";
// Importation de la fonction pour récupérer la liste de référence des voitures
import { fetchVoitures } from "../Api/api"; 

export function ModifierVoiture({ isOpen, onClose, onVoitureModified, voiture }) {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        modele: "",
        couleur: "",
        stock: "",
        prix: ""
    });

    const [allVoitures, setAllVoitures] = useState([]); // Stocke les voitures pour la vérification
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Gère l'affichage de l'erreur

    // Charger les données de la voiture et la liste complète à l'ouverture
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const voitures = await fetchVoitures();
                setAllVoitures(voitures || []);
            } catch (error) {
                console.error("Erreur de chargement des voitures:", error);
            }
        };

        if (isOpen) {
            setErrorMessage(""); // Réinitialise l'erreur à l'ouverture
            loadInitialData();
            if (voiture) {
                setFormData({
                    modele: voiture.modele,
                    couleur: voiture.couleur,
                    stock: voiture.stock,
                    prix: voiture.prix
                });
            }
        }
    }, [voiture, isOpen]);

    if (!voiture) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Nettoie l'erreur précédente

        // 1. VERIFICATION LOCALE DU DOUBLON (Modèle + Couleur identiques sur une AUTRE voiture)
        const isDuplicate = allVoitures.some(v => 
            v.id_voiture !== voiture.id_voiture && 
            v.modele.trim().toLowerCase() === formData.modele.trim().toLowerCase() &&
            v.couleur.trim().toLowerCase() === formData.couleur.trim().toLowerCase()
        );

        if (isDuplicate) {
            setErrorMessage("Ce modèle existe déjà avec cette couleur.");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/put/voitures/${voiture.id_voiture}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    modele: formData.modele,
                    couleur: formData.couleur,
                    stock: parseInt(formData.stock),
                    prix: parseFloat(formData.prix)
                })
            });

            if (res.ok) {
                const data = await res.json();
                onVoitureModified(data);
                onClose();
            } else {
                // 2. RECUPERATION DU MESSAGE D'ERREUR DU SERVEUR EN CAS D'ECHEC
                const errorData = await res.json().catch(() => ({}));
                setErrorMessage(errorData.message || "Ce modèle existe déjà avec cette couleur.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            setErrorMessage("Une erreur réseau est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuppress = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const isConfirmed = window.confirm("Voulez-vous vraiment supprimer cette voiture ?");
        if (!isConfirmed) return;

        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/delete/voiture/${voiture.id_voiture}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                const data = await res.json();
                onVoitureModified(data);
                onClose();
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modifier la voiture</p>
                    <button className="delete" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Modèle</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="modele"
                                    value={formData.modele}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Couleur</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="couleur"
                                    value={formData.couleur}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Stock</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Prix</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    step="0.01"
                                    name="prix"
                                    value={formData.prix}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* EMPLACEMENT DU MESSAGE D'ERREUR SOUS LE PRIX */}
                        {errorMessage && (
                            <p className="help is-danger has-text-danger mt-3" style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                                {errorMessage}
                            </p>
                        )}
                    </form>
                </section>
                <footer className="modal-card-foot">
                    <button className="button" onClick={onClose}>Annuler</button>
                    <button
                        className={`button is-success ${isLoading ? 'is-loading' : ''}`}
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        Modifier
                    </button>
                    {user?.delStock === 1 && (
                        <button
                            className={`button is-danger ${isLoading ? 'is-loading' : ''}`}
                            onClick={handleSuppress}
                            disabled={isLoading}
                        >
                            Supprimer
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
}
