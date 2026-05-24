import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../authContext";

export function ModifierClient({ isOpen, onClose, onClientModified, client }) {
    // Récupération des données utilisateur et de ses permissions (ex: delClients)
    const { user } = useContext(AuthContext);

    // État local pour stocker les valeurs saisies dans les champs du formulaire
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: ""
    });

    // États de gestion : indicateur de chargement API et messages d'erreur du PDF / validation
    const [isLoading, setIsLoading] = useState(false);
    const [erreurPdf, setErreurPdf] = useState("");

    // Hook synchronisant les champs du formulaire dès que le modal s'ouvre ou change de client
    useEffect(() => {
        if (client) {
            setFormData({
                full_name: client.full_name || "", // Sécurité si la valeur est nulle
                email: client.email || "",
                phone: client.phone || ""
            });
            setErreurPdf(""); // Réinitialise l'erreur à l'ouverture
        }
    }, [client, isOpen]);

    // Gestionnaire générique des entrées clavier : met à jour l'état au fur et à mesure de la saisie
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Fonction de décodage et téléchargement du document PDF stocké localement
    const handleDownloadPdf = () => {
        setErreurPdf("");
        
        if (!client?.email) {
            setErreurPdf("Données du client manquantes.");
            return;
        }

        // Récupération de la chaîne Base64 liée à l'identifiant email unique du client
        const chaineBase64 = localStorage.getItem(`client_pdf_${client.email}`);

        if (!chaineBase64) {
            setErreurPdf("Aucun document PDF associé trouvé pour ce client.");
            return;
        }

        try {
            // Nettoyage de l'en-tête "data:application/pdf;base64," si présent
            const parties = chaineBase64.split(',');
            const octetsBruts = atob(parties[1] || parties[0]);
            let n = octetsBruts.length;
            const tableauOctets = new Uint8Array(n);

            // Conversion de la chaîne binaire brute en tableau de nombres 8 bits
            while (n--) {
                tableauOctets[n] = octetsBruts.charCodeAt(n);
            }

            // Génération d'un objet de fichier Blob typé en PDF
            const fichierBlob = new Blob([tableauOctets], { type: 'application/pdf' });
            const urlFichier = URL.createObjectURL(fichierBlob);

            // Création d'un élément d'ancrage HTML invisible pour déclencher le téléchargement
            const lienTemporaire = document.createElement('a');
            lienTemporaire.href = urlFichier;
            // Formatage du nom de fichier en remplaçant les espaces par des underscores
            lienTemporaire.download = `Document_${(client.full_name || "client").replace(/\s+/g, '_')}.pdf`;
            
            document.body.appendChild(lienTemporaire);
            lienTemporaire.click(); // Simulation du clic utilisateur
            
            // Nettoyage de la mémoire et de l'arbre DOM après téléchargement
            document.body.removeChild(lienTemporaire);
            URL.revokeObjectURL(urlFichier);

        } catch (error) {
            console.error("Erreur de traitement du PDF :", error);
            setErreurPdf("Impossible de lire le fichier PDF.");
        }
    };

    // Soumission des modifications vers l'API Backend
    const handleSubmit = async (e) => {
        if (e) e.preventDefault(); // Stoppe le rechargement natif de la page
        if (!client?.id_client) return;

        setErreurPdf(""); // Réinitialise l'erreur au début de la soumission

        // Validation du format de téléphone (Ex: 514-123-4567)
        const regexTelephone = /^\d{3}-\d{3}-\d{4}$/;
        if (!regexTelephone.test(formData.phone)) {
            setErreurPdf("Erreur : Le numéro de téléphone doit respecter le format XXX-XXX-XXXX (ex: 514-123-4567).");
            return; // Bloque la soumission
        }

        setIsLoading(true);

        try {
            const res = await fetch(`http://localhost:3000/put/clients/${client.id_client}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData) // Envoi des nouvelles données saisies
            });

            if (res.ok) {
                // Si l'e-mail change, on migre la clé du PDF local pour ne pas perdre le fichier
                if (client.email !== formData.email) {
                    const ancienPdf = localStorage.getItem(`client_pdf_${client.email}`);
                    if (ancienPdf) {
                        localStorage.setItem(`client_pdf_${formData.email}`, ancienPdf);
                        localStorage.removeItem(`client_pdf_${client.email}`);
                    }
                }

                const data = await res.json();
                onClientModified(data); // Notifie le parent du succès de l'opération
                onClose(); // Ferme la fenêtre modale
            } else {
                setErreurPdf("Erreur serveur lors de la modification du client.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            setErreurPdf("Une erreur est survenue lors de l'envoi des données.");
        } finally {
            setIsLoading(false);
        }
    };

    // Suppression définitive du client
    const handleSupress = async (e) => {
        if (e) e.preventDefault();
        if (!client?.id_client) return;

        // Fenêtre de confirmation de sécurité standard avant suppression
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce client ?")) return;

        setIsLoading(true);
        setErreurPdf("");

        try {
            const res = await fetch(`http://localhost:3000/delete/client/${client.id_client}`, {
                method: "DELETE", // Requête HTTP DELETE
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                    "Content-Type": "application/json"
                }
            });

            if (res.ok) {
                // Suppression du fichier PDF local associé à l'e-mail du client supprimé
                localStorage.removeItem(`client_pdf_${client.email}`);

                const data = await res.json();
                onClientModified(data); // Rafraîchit la liste côté parent
                onClose();
            } else {
                setErreurPdf("Erreur serveur lors de la suppression du client.");
            }
        } catch (error) {
            console.error("Erreur:", error);
            setErreurPdf("Une erreur est survenue lors de la suppression.");
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
                    <button type="button" className="delete" onClick={onClose}></button>
                </header>
                <form id="edit-client-form" onSubmit={handleSubmit}>
                    <section className="modal-card-body">
                        {/* Affichage de la notification d'erreur Bulma */}
                        {erreurPdf && (
                            <div className="notification is-danger is-light">
                                {erreurPdf}
                            </div>
                        )}

                        <div className="field">
                            <label className="label">Nom complet</label>
                            <div className="control">
                                <input className="input" type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} required />
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
                                    placeholder="514-123-4567"
                                    required 
                                />
                            </div>
                        </div>

                        {/* Bouton de téléchargement du PDF existant */}
                        <div className="field mt-5">
                            <label className="label">Fichier joint</label>
                            <div className="control">
                                <button type="button" className="button is-link is-outlined is-fullwidth" onClick={handleDownloadPdf}>
                                    <span className="icon">
                                        <i className="fas fa-file-download"></i>
                                    </span>
                                    <span>Télécharger le PDF du client</span>
                                </button>
                            </div>
                            {erreurPdf && <p className="help is-danger mt-2">{erreurPdf}</p>}
                        </div>
                    </section>

                    <footer className="modal-card-foot">
                        <div className="buttons">
                            <button type="submit" className={`button is-primary ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>
                                Enregistrer
                            </button>
                            {user?.role === "admin" && (
                                <button type="button" className="button is-danger" onClick={handleSupress} disabled={isLoading}>
                                    Supprimer
                                </button>
                            )}
                            <button type="button" className="button" onClick={onClose} disabled={isLoading}>
                                Annuler
                            </button>
                        </div>
                    </footer>
                </form>
            </div>
        </div>
    );
}
