import { useState } from "react";

export function CreeRole({ isOpen, onClose, onRoleCreated }) {
    const [formData, setFormData] = useState({
        nom: "",
        seeStock: false,
        seeClients: false,
        modStock: false,
        modClients: false,
        modSell: false,
        addClient: false
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3000/role", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                onRoleCreated(data);
                setFormData({
                    nom: "",
                    seeStock: false,
                    seeClients: false,
                    modStock: false,
                    modClients: false,
                    modSell: false,
                    addClient: false
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
                    <p className="modal-card-title">Créer un nouveau rôle</p>
                    <button className="delete" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Nom du rôle</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="seeStock"
                                    checked={formData.seeStock}
                                    onChange={handleChange}
                                />
                                {' '}Voir Stock
                            </label>
                        </div>

                        <div className="field">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="seeClients"
                                    checked={formData.seeClients}
                                    onChange={handleChange}
                                />
                                {' '}Voir Clients
                            </label>
                        </div>

                        <div className="field">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="modStock"
                                    checked={formData.modStock}
                                    onChange={handleChange}
                                />
                                {' '}Modifier Stock
                            </label>
                        </div>

                        <div className="field">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="modClients"
                                    checked={formData.modClients}
                                    onChange={handleChange}
                                />
                                {' '}Modifier Clients
                            </label>
                        </div>

                        <div className="field">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="modSell"
                                    checked={formData.modSell}
                                    onChange={handleChange}
                                />
                                {' '}Modifier Vente
                            </label>
                        </div>

                        <div className="field">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    name="addClient"
                                    checked={formData.addClient}
                                    onChange={handleChange}
                                />
                                {' '}Ajouter Client
                            </label>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button 
                                    type="submit" 
                                    className="button is-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Création en cours...' : 'Créer'}
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
