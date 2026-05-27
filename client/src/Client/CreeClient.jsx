import { useState } from "react";
import { InputTelephone } from "../assets/TelepohoneForm";

export function CreeClient({ isOpen, onClose, onClientCreated }) {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: ""
    });

    const [estSurvole, setEstSurvole] = useState(false);
    const [fichier, setFichier] = useState(null);
    const [erreurFichier, setErreurFichier] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setEstSurvole(true);
    };

    const handleDragLeave = () => {
        setEstSurvole(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setEstSurvole(false);
        setErreurFichier('');

        const fichiersDeposes = e.dataTransfer.files;
        if (fichiersDeposes.length > 0) {
            validerEtEnregistrerFichier(fichiersDeposes[0]);
        }
    };

    const handleFileChange = (e) => {
        setErreurFichier('');
        if (e.target.files.length > 0) {
            validerEtEnregistrerFichier(e.target.files[0]);
        }
    };

    const validerEtEnregistrerFichier = (fichierSelectionne) => {
        if (fichierSelectionne.type === 'application/pdf') {
            if (fichierSelectionne.size > 5 * 1024 * 1024) {
                setErreurFichier('Erreur : Fichier trop lourd (max 5 Mo pour le localStorage).');
                setFichier(null);
                return;
            }
            setFichier(fichierSelectionne);
        } else {
            setErreurFichier('Erreur : Seuls les fichiers PDF sont acceptés.');
            setFichier(null);
        }
    };

    const convertirEnBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleAnnuler = () => {
        setFormData({
            full_name: "",
            email: "",
            phone: ""
        });
        setFichier(null);
        setErreurFichier("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreurFichier(""); // Réinitialise l'erreur au début

        // Validation du format de téléphone (Ex: 514-123-4567)
        const regexTelephone = /^\d{3}-\d{3}-\d{4}$/;
        if (!regexTelephone.test(formData.phone)) {
            setErreurFichier("Erreur : Le numéro de téléphone doit respecter le format XXX-XXX-XXXX (ex: 514-123-4567).");
            return; // Bloque la soumission
        }

        setIsLoading(true);

        try {
            // 1. On crée une instance de FormData au lieu d'un objet JSON
            const donneesFormulaire = new FormData();
            
            // 2. On ajoute les champs textes
            donneesFormulaire.append("full_name", formData.full_name);
            donneesFormulaire.append("email", formData.email);
            donneesFormulaire.append("phone", formData.phone);
            
            // 3. On ajoute le fichier PDF SEULEMENT s'il existe (puisqu'il est optionnel)
            if (fichier) {
                // Le premier paramètre 'pdf' doit être EXACTEMENT le même nom que dans upload.single('pdf') côté serveur
                donneesFormulaire.append("pdf", fichier); 
            }

            // 4. Envoi de la requête HTTP
            const res = await fetch("http://localhost:3000/post/client", {
                method: "POST",
                headers: {
                    // IMPORTANT : On retire "Content-Type": "application/json"
                    // Le navigateur va configurer automatiquement le bon Content-Type (multipart/form-data)
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: donneesFormulaire // On passe l'objet FormData ici
            });

            if (res.ok) {
                const data = await res.json();
                onClientCreated(data);
                
                // Réinitialisation des états
                setFormData({
                    full_name: "",
                    email: "",
                    phone: ""
                });
                setFichier(null);
                onClose();
            } else {
                const errorData = await res.json().catch(() => ({}));
                setErreurFichier(errorData.error || "Erreur serveur lors de la création du client.");
            }

        } catch (error) {
            console.error("Erreur lors de l'enregistrement :", error);
            setErreurFichier("Une erreur est survenue lors du traitement ou de l'envoi.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={handleAnnuler}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Créer un nouveau client</p>
                    <button type="button" className="delete" onClick={handleAnnuler}></button>
                </header>
                <form onSubmit={handleSubmit}>
                    <section className="modal-card-body">
                        {/* 2. Affichage de l'erreur Bulma s'il y a un problème de téléphone ou de fichier */}
                        {erreurFichier && (
                            <div className="notification is-danger is-light">
                                {erreurFichier}
                            </div>
                        )}

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

                        {/* <div className="field">
                            <label className="label">Téléphone</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="tel"
                                    name="phone"
                                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="514-123-4567"
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

                        <div className="field mt-5">
                            <label className="label">Document PDF associé</label>
                            <div className="file" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                                <label className="file-label is-block" style={{ width: '100%' }}>
                                    <input className="file-input" type="file" name="pdf" accept=".pdf,application/pdf" onChange={handleFileChange} />
                                    <span className="file-cta is-flex is-flex-direction-column is-align-items-center p-6" style={{ border: estSurvole ? '2px solid #485fc7' : '1px solid #b5d0f5', borderRadius: '16px', backgroundColor: '#f4f8ff', cursor: 'pointer', height: 'auto' }}>
                                        <div className="is-flex is-justify-content-center mb-3">
                                            <div 
                                                className="has-background-link is-flex is-align-items-center is-justify-content-center"
                                                style={{ width: '48px', height: '48px', borderRadius: '12px' }}
                                            >
                                                <span className="file-icon has-text-white" style={{ margin: 0 }}>
                                                    <i className="fas fa-file-pdf fa-lg"></i>
                                                </span>
                                            </div>
                                        </div>
                                        <span className="file-label has-text-centered has-text-weight-semibold has-text-black">
                                            {fichier ? fichier.name : "Glissez votre PDF ici ou cliquez pour parcourir"}
                                        </span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <footer className="modal-card-foot">
                        <div className="buttons">
                            <button type="submit" className={`button is-primary ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>
                                Créer
                            </button>
                            <button type="button" className="button" onClick={handleAnnuler} disabled={isLoading}>
                                Annuler
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
        </div>
    );
}
