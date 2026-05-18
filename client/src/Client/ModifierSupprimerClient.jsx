import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export function ModifierClient({ isOpen, onClose, onClientModified, client }) {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [erreurPdf, setErreurPdf] = useState("");

    useEffect(() => {
        if (client) {
            setFormData({
                full_name: client.full_name,
                email: client.email,
                phone: client.phone
            });
            setErreurPdf("");
        }
    }, [client, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDownloadPdf = () => {
        setErreurPdf("");
        
        // Récupération basée sur l'EMAIL initial du client d'origine
        const chaineBase64 = localStorage.getItem(`client_pdf_${client.email}`);

        if (!chaineBase64) {
            setErreurPdf("Aucun document PDF associé trouvé pour ce client.");
            return;
        }

        try {
            const parties = chaineBase64.split(',');
            const octetsBruts = atob(parties[1] || parties[0]);
            let n = octetsBruts.length;
            const tableauOctets = new Uint8Array(n);

            while (n--) {
                tableauOctets[n] = octetsBruts.charCodeAt(n);
            }

            const fichierBlob = new Blob([tableauOctets], { type: 'application/pdf' });
            const urlFichier = URL.createObjectURL(fichierBlob);

            const lienTemporaire = document.createElement('a');
            lienTemporaire.href = urlFichier;
            lienTemporaire.download = `Document_${client.full_name.replace(/\s+/g, '_')}.pdf`;
            
            document.body.appendChild(lienTemporaire);
            lienTemporaire.click();
            
            document.body.removeChild(lienTemporaire);
            URL.revokeObjectURL(urlFichier);

        } catch (error) {
            console.error("Erreur de traitement du PDF :", error);
            setErreurPdf("Impossible de lire le fichier PDF.");
        }
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
                // Si l'adresse email a changé, on transfère le PDF sur la nouvelle clé email
                if (client.email !== formData.email) {
                    const ancienPdf = localStorage.getItem(`client_pdf_${client.email}`);
                    if (ancienPdf) {
                        localStorage.setItem(`client_pdf_${formData.email}`, ancienPdf);
                        localStorage.removeItem(`client_pdf_${client.email}`);
                    }
                }

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
                // Nettoyage basé sur l'EMAIL
                localStorage.removeItem(`client_pdf_${client.email}`);

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
                    <button type="button" className="delete" onClick={onClose}></button>
                </header>
                <section className="modal-card-body">
                    <form onSubmit={handleSubmit}>
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
                                <input className="input" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>

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
                    </form>
                </section>
                <footer className="modal-card-foot">
                    <button className={`button is-success ${isLoading ? 'is-loading' : ''}`} onClick={handleSubmit} disabled={isLoading}>Modifier</button>
                    {user.delClients === "1" && (
                        <button className={`button is-danger ${isLoading ? 'is-loading' : ''}`} onClick={handleSupress} disabled={isLoading}>Supprimer</button>
                    )}
                    <button type="button" className="button is-light" onClick={onClose}>Annuler</button>
                </footer>
            </div>
        </div>
    );
}
