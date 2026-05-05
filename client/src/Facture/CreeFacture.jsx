import { useState, useEffect } from "react";

export function CreeFacture({ isOpen, onClose, onFactureCreated }) {
    const [formData, setFormData] = useState({
        client_name: "",
        email: "",
        phone: ""
    });

    const [allClients, setAllClients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            getAllClients();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleKeyDown = (e) => {
        // Si l'utilisateur appuie sur Entrée
        if (e.key === 'Enter') {
            // On trouve les clients qui correspondent à la saisie actuelle
            const matches = allClients.filter(client => 
                client.full_name.toLowerCase().includes(formData.client_name.toLowerCase())
            );

            // Si on a au moins un résultat
            if (matches.length > 0) {
                e.preventDefault(); // Empêche la soumission immédiate du formulaire
                const firstClient = matches[0];
                
                // On remplit le champs avec le premier de la liste
                setFormData({
                    client_name: firstClient.full_name,
                });
            }
        }
    }
    const getAllClients = async () => {
        try {
            const res = await fetch("http://localhost:3000/allClient", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            const data = await res.json();
            setAllClients(data);
        }
        } catch (error) {
            console.error("Erreur lors de la récupération des clients:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3000/post/payement", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                onFactureCreated(data);
                setFormData({
                    client_name: "",
                    email: "",
                    phone: ""
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
                                type="text"
                                name="client_name"
                                list="clients-list" // Lie l'input au datalist via l'ID
                                value={formData.client_name}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                autoComplete="off"
                                required
                            />
                            <datalist id="clients-list">
                                {allClients
                                    .filter(client => 
                                        client.full_name.toLowerCase().includes(formData.client_name.toLowerCase())
                                    )
                                    .slice(0, 3) // Garde seulement les 3 premiers résultats
                                    .map((client) => (
                                        <option key={client.id} value={client.full_name} />
                                    ))
                                }
                            </datalist>
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
                        Créer
                    </button>
                </footer>
            </div>
        </div>
    );
}