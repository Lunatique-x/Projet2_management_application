import { useState } from "react";

export function CreeVoiture({ isOpen, onClose, onVoitureCreated }) {
    const [formData, setFormData] = useState({
        modele: "",
        couleur: "",
        stock: "",
        prix: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    <p className="modal-card-title">Créer une nouvelle voiture</p>
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
