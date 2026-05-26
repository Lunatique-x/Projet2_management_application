import { useState, useEffect } from "react";

export function ModifierEmploye({ isOpen, onClose, onEmployeModified, employe }) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        commission: 0,
        role_id: ""
    });
    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        async function getRoles() {
            try {
                const res = await fetch("http://localhost:3000/allRole", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json"
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setRoles(data);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des rôles:", error);
            }
        }

        getRoles();
    }, [isOpen]);

    useEffect(() => {
        if (!employe) return;
        setFormData({
            full_name: employe.full_name || "",
            email: employe.email || "",
            password: "",
            phone: employe.phone || "",
            commission: employe.commission || 0,
            role_id: employe.role_id || ""
        });
    }, [employe]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employe) return;

        setIsLoading(true);
        try {
            const body = {
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                commission: Number(formData.commission),
                role_id: formData.role_id
            };

            if (formData.password.trim()) {
                body.password = formData.password;
            }

            const res = await fetch(`http://localhost:3000/put/employes/${employe.id_employe}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                await res.json();
                onEmployeModified();
                onClose();
            } else {
                const errorData = await res.json();
                console.error("Erreur de mise à jour de l'employé :", errorData);
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'employé :", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!employe) return;
        const confirmed = window.confirm("Voulez-vous vraiment supprimer cet employé ? Cette action est irréversible.");
        if (!confirmed) return;

        setIsLoading(true);
        try {
            const res = await fetch(`http://localhost:3000/employe/${employe.id_employe}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                await res.json();
                onEmployeModified();
                onClose();
            } else {
                const errorData = await res.json();
                console.error("Erreur lors de la suppression de l'employé :", errorData);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'employé :", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modifier l'employé</p>
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
                            <label className="label">Mot de passe (laisser vide pour conserver)</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
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

                        <div className="field">
                            <label className="label">Commission (%)</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="number"
                                    name="commission"
                                    value={formData.commission}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Rôle</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select
                                        name="role_id"
                                        value={formData.role_id}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionner un rôle</option>
                                        {roles.map((role) => (
                                            <option key={role.id_role} value={role.id_role}>
                                                {role.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="field is-grouped">
                            <div className="control">
                                <button
                                    type="submit"
                                    className="button is-success"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Modification en cours...' : 'Modifier'}
                                </button>
                            </div>
                            <div className="control">
                                <button
                                    type="button"
                                    className="button is-danger"
                                    disabled={isLoading}
                                    onClick={handleDelete}
                                >
                                    {isLoading ? 'Suppression...' : 'Supprimer'}
                                </button>
                            </div>
                            <div className="control">
                                <button
                                    type="button"
                                    className="button"
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
