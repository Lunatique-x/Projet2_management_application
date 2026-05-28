import { useState, useEffect } from "react";

import { InputTelephone } from "../assets/TelepohoneForm";

export function CreeEmploye({ isOpen, onClose, onEmployeCreated }) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        commission: 0,
        id_role: ""
    });

    const [roles, setRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState(""); // État pour stocker l'erreur d'email

    useEffect(() => {
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

        if (isOpen) {
            getRoles();
            setEmailError(""); // Réinitialise l'erreur à l'ouverture du modal
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Efface le message d'erreur dès que l'utilisateur modifie l'email
        if (name === "email") {
            setEmailError("");
        }

        // Logique de formatage automatique pour le champ téléphone
        if (name === "phone") {
            // Supprime tout ce qui n'est pas un chiffre
            const cleaned = value.replace(/\D/g, "");
            
            // Limite à 10 chiffres maximum
            const truncated = cleaned.slice(0, 10);
            
            // Applique le masque 123-456-7890 au fur et à mesure de la saisie
            let formattedPhone = truncated;
            if (truncated.length > 3 && truncated.length <= 6) {
                formattedPhone = `${truncated.slice(0, 3)}-${truncated.slice(3)}`;
            } else if (truncated.length > 6) {
                formattedPhone = `${truncated.slice(0, 3)}-${truncated.slice(3, 6)}-${truncated.slice(6)}`;
            }

            setFormData(prev => ({
                ...prev,
                [name]: formattedPhone
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError(""); // Réinitialise l'erreur avant la soumission

        // Sécurité Regex : Vérifie strictement le format 123-456-7890
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Erreur : Le numéro de téléphone doit respecter le format 123-456-7890");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("http://localhost:3000/post/employe", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    role_id: formData.id_role
                })
            });

            if (res.ok) {
                const data = await res.json();
                onEmployeCreated(data);
                setFormData({
                    full_name: "",
                    email: "",
                    password: "",
                    phone: "",
                    commission: 0,
                    id_role: ""
                });
                onClose();
            } else if (res.status === 400) {
                // Intercepte l'erreur 400 envoyée par l'API pour l'email en doublon
                const errorData = await res.json().catch(() => ({}));
                setEmailError(errorData.message || "Cet adresse email est déjà utilisée.");
            } else {
                alert("Une erreur inattendue est survenue.");
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
                    <p className="modal-card-title">Ajouter un nouvel employé</p>
                    <button className="delete" type="button" onClick={onClose}></button>
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
                            {/* Message d'erreur injecté sous le champ email */}
                            {emailError && (
                                <p className="help is-danger" style={{ color: "#f14668", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                                    {emailError}
                                </p>
                            )}
                        </div>

                        <div className="field">
                            <label className="label">Mot de passe</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* <div className="field">
                            <label className="label">Téléphone</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="tel"
                                    name="phone"
                                    placeholder="123-456-7890"
                                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                    title="Le format doit être 123-456-7890"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div> */}
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
                                <div className="select">
                                    <select
                                        name="id_role"
                                        value={formData.id_role}
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
                                    {isLoading ? 'Création en cours...' : 'Créer'}
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
