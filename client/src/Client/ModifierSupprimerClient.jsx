import { useState, useEffect } from "react";

export function ModifierClient({ isOpen, onClose, onClientModified, client }) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (client) {
            setFormData({
                full_name: client.full_name,
                email: client.email,
                phone: client.phone
            });
        }
    }, [client, isOpen]);

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
            const res = await fetch(`http://localhost:3000/put/clients/${client.id_client}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                onClientModified(data);
                onClose();
            }
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSupress = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`http://localhost:3000/delete/client/${client.id_client}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                onClientModified(data);
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
                    <p className="modal-card-title">Modifier le client</p>
                    <button className="delete" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Nom complet</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Téléphone</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
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
                    <button
                        className={`button is-danger ${isLoading ? 'is-loading' : ''}`}
                        onClick={handleSupress}
                        disabled={isLoading}
                    >
                        Supprimer
                    </button>
                </footer>
            </div>
        </div>
    );
}
