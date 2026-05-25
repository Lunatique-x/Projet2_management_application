import { useState, useEffect } from "react";

export function CreeVoiture({ isOpen, onClose, onVoitureCreated }) {
    const [formData, setFormData] = useState({
        modele: "",
        couleur: "",
        stock: "",
        prix: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Nouvel état pour l'erreur de doublon

    // Réinitialise l'erreur à chaque ouverture du modal
    useEffect(() => {
        if (isOpen) {
            setErrorMessage("");
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Efface le message d'erreur dès que l'utilisateur modifie un champ
        setErrorMessage("");

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3000/post/voiture", {
                method: "POST",
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
                onVoitureCreated(data);
                setFormData({
                    modele: "",
                    couleur: "",
                    stock: "",
                    prix: ""
                });
                onClose();
            } else {
                // Intercepte la réponse en cas d'erreur de doublon (Statut 400 ou autre)
                const errorData = await res.json().catch(() => ({}));
                setErrorMessage(errorData.message || "Ce modèle existe déjà avec cette couleur.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            setErrorMessage("Impossible de contacter le serveur.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Ajouter une nouvelle modèle de voiture</p>
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
                                    placeholder="Ex: BMW 3 Series"
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
                                    placeholder="Ex: Noir"
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
                                    placeholder="0"
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
                                    placeholder="0.00"
                                    value={formData.prix}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Affichage du message de sécurité juste avant les boutons de validation */}
                        {errorMessage && (
                            <div className="field">
                                <p className="help is-danger" style={{ color: "#f14668", fontSize: "0.85rem", marginBottom: "1rem", fontWeight: "500" }}>
                                    {errorMessage}
                                </p>
                            </div>
                        )}

                        <div className="field is-grouped">
                            <div className="control">
                                <button
                                    type="submit"
                                    className="button is-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Création..." : "Créer"}
                                </button>
                            </div>
                            <div className="control">
                                <button
                                    type="button"
                                    className="button is-light"
                                    onClick={onClose}
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
