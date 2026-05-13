import { useState, useEffect } from "react";

import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export function ModifierVoiture({ isOpen, onClose, onVoitureModified, voiture }) {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        modele: "",
        couleur: "",
        stock: "",
        prix: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (voiture) {
            setFormData({
                modele: voiture.modele,
                couleur: voiture.couleur,
                stock: voiture.stock,
                prix: voiture.prix
            });
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
        setIsLoading(true);

        try {
            const res = await fetch(`http://localhost:3000/put/voiture/${voiture.id_voiture}`, {
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
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuppress = async (e) => {
        e.preventDefault();

        const isConfirmed = window.confirm("Voulez-vous vraiment supprimer cette voiture ?");
        if (!isConfirmed) {
            return;
        }

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
                    {user.delStock === 1&&(
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
