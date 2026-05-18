import { useState } from "react";

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

    // Nouvelle fonction pour réinitialiser les états et fermer la modale
    const handleAnnuler = () => {
        setFormData({
            full_name: "",
            email: "",
            phone: ""
        });
        setFichier(null);
        setErreurFichier("");
        onClose(); // Appelle la fonction de fermeture du parent
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (fichier) {
                const chaineBase64 = await convertirEnBase64(fichier);
                localStorage.setItem(`client_pdf_${formData.email}`, chaineBase64);
            }

            const res = await fetch("http://localhost:3000/post/client", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                onClientCreated(data);
                
                setFormData({
                    full_name: "",
                    email: "",
                    phone: ""
                });
                setFichier(null);
                onClose();
            } else {
                setErreurFichier("Erreur serveur lors de la création du client.");
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
            {/* Clic à l'extérieur de la boîte de dialogue : réinitialise et ferme */}
            <div className="modal-background" onClick={handleAnnuler}></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Créer un nouveau client</p>
                    {/* Bouton croix en haut à droite : réinitialise et ferme */}
                    <button type="button" className="delete" onClick={handleAnnuler}></button>
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

                        <div className="field mt-5">
                            <label className="label">Document PDF associé</label>
                            <div className="file" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                                <label className="file-label is-block" style={{ width: '100%' }}>
                                    <input className="file-input" type="file" name="pdf" accept=".pdf,application/pdf" onChange={handleFileChange} />
                                    <span className="file-cta is-flex is-flex-direction-column is-align-items-center p-6" style={{ border: estSurvole ? '2px solid #485fc7' : '1px solid #b5d0f5', borderRadius: '16px', backgroundColor: '#f4f8ff', cursor: 'pointer', height: 'auto' }}>
                                        <div className="is-flex is-justify-content-center mb-3">
                                            {/* Carré bleu supérieur avec l'icône FontAwesome fonctionnelle */}
                                            <div className="is-flex is-justify-content-center mb-3">
                                                <div 
                                                    className="has-background-link is-flex is-align-items-center is-justify-content-center"
                                                    style={{ width: '48px', height: '48px', borderRadius: '12px' }}
                                                >
                                                    {/* "fas fa-file-pdf" définit la forme, "fa-lg" ajuste la taille idéale, et "has-text-white" la met en blanc */}
                                                    <i className="fas fa-file-pdf fa-lg has-text-white"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="file-label is-size-6 has-text-weight-normal has-text-black p-0" style={{ display: 'inline' }}>
                                            <span className="has-text-link has-text-weight-semibold" style={{ textDecoration: 'underline' }}>Click To Upload</span> or drag and drop
                                        </span>
                                    </span>
                                </label>
                            </div>
                            
                            {/* Messages d'information bas de page */}
                            {erreurFichier && <div className="notification is-danger is-light mt-2 py-2 px-3 is-size-7">{erreurFichier}</div>}
                            {fichier && <div className="notification is-success is-light mt-2 py-2 px-3 is-size-7">Fichier prêt : <strong>{fichier.name}</strong></div>}
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot">
                    {/* Bouton Annuler en bas : réinitialise et ferme */}
                    <button type="button" className="button" onClick={handleAnnuler}>Annuler</button>
                    <button type="submit" className={`button is-success ${isLoading ? 'is-loading' : ''}`} onClick={handleSubmit} disabled={isLoading}>Créer</button>
                </footer>
            </div>
        </div>
    );
}
