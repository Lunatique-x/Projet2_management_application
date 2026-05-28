import { useState, useEffect } from "react";
import { InputTelephone } from "../assets/TelepohoneForm";

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
    const [allEmployes, setAllEmployes] = useState([]); // Pour vérifier les doublons d'email
    const [isLoading, setIsLoading] = useState(false);
    const [erreurSaisie, setErreurSaisie] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        // Récupération des rôles
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

        // Récupération de tous les employés pour valider l'unicité de l'email
        async function getAllEmployes() {
            try {
                const res = await fetch("http://localhost:3000/allEmploye", { 
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`,
                        "Content-Type": "application/json"
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAllEmployes(data || []);
                }
            } catch (error) {
                console.error("Erreur lors du chargement de la liste des employés:", error);
            }
        }

        getRoles();
        getAllEmployes();
    }, [isOpen]);

    useEffect(() => {
        if (!employe) return;

        let rawPhone = employe.phone || "";
        let formattedPhone = rawPhone;

        if (rawPhone) {
            const digits = rawPhone.replace(/[^\d]/g, '').slice(0, 10);
            if (digits.length >= 7) {
                formattedPhone = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
            } else if (digits.length >= 4) {
                formattedPhone = `${digits.slice(0, 3)}-${digits.slice(3)}`;
            } else {
                formattedPhone = digits;
            }
        }

        setFormData({
            full_name: employe.full_name || "",
            email: employe.email || "",
            password: "",
            phone: formattedPhone, 
            commission: employe.commission || 0,
            role_id: employe.role_id || ""
        });
        setErreurSaisie(""); 
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

        setErreurSaisie("");

        // 1. BLOCAGE LOCALE SI L'EMAIL EXISTE DÉJÀ (sur un AUTRE employé)
        const emailExisteDeja = allEmployes.some(emp => 
            emp.id_employe !== employe.id_employe && 
            emp.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
        );

        if (emailExisteDeja) {
            setErreurSaisie("Cet email existe déjà.");
            return;
        }

        // 2. VÉRIFICATION DU FORMAT DU TÉLÉPHONE
        const regexTelephone = /^\d{3}-\d{3}-\d{4}$/;
        if (!regexTelephone.test(formData.phone)) {
            setErreurSaisie("Le numéro de téléphone doit être complet (ex: 514-123-4567).");
            return;
        }

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
                onEmployeModified();
                onClose();
            } else {
                const errorData = await res.json().catch(() => ({}));
                setErreurSaisie(errorData.message || "Cet email existe déjà.");
            }
        } catch (error) {
            setErreurSaisie("Une erreur réseau ou serveur est survenue.");
            console.error("Erreur lors de la mise à jour :", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!employe) return;
        const confirmed = window.confirm("Voulez-vous vraiment supprimer cet employé ? Cette action est irréversible.");
        if (!confirmed) return;

        setIsLoading(true);
        setErreurSaisie("");
        try {
            const res = await fetch(`http://localhost:3000/delete/employe/${employe.id_employe}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                onEmployeModified();
                onClose();
            } else {
                const errorData = await res.json().catch(() => ({}));
                setErreurSaisie(errorData.message || "Erreur lors de la suppression de l'employé.");
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
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
                    <button type="button" className="delete" onClick={onClose}></button>
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

                        <InputTelephone
                            label="Téléphone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required={true}
                        />

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
                        {/* EMPLACEMENT DU MESSAGE D'ERREUR SOUS LE PRIX */}
                        {erreurSaisie && (
                            <p className="help is-danger has-text-danger mt-3" style={{ fontSize: "0.95rem", fontWeight: "500" }}>
                                {erreurSaisie}
                            </p>
                        )}

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
