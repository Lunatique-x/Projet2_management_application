import { useState } from "react";

export function CreeRole({ isOpen, onClose, onRoleCreated }) {
  // 1. Initialisation incluant désormais delSell
  const initialFormState = {
    nom: "",
    viewStock: false,
    modStock: false,
    viewClients: false,
    delClients: false,
    modClients: false,
    viewSell: false,
    addSell: false,
    addClient: false,
    addStock: false,
    delStock: false,
    modSell: false,
    delSell: false // <- Ajouté selon votre nouvelle route
  };

  // 2. Dictionnaire mis à jour avec la traduction pour delSell
  const labelMapping = {
    viewStock: "Voir le Stock",
    modStock: "Modifier le Stock",
    addStock: "Ajouter au Stock",
    delStock: "Supprimer du Stock",
    viewClients: "Voir les Clients",
    modClients: "Modifier les Clients",
    addClient: "Ajouter un Client",
    delClients: "Supprimer les Clients",
    viewSell: "Voir les Ventes",
    addSell: "Ajouter une Vente",
    modSell: "Modifier une Vente",
    delSell: "Supprimer une Vente" // <- Ajouté selon votre nouvelle route
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
    setErrorMsg("");

    try {
      const res = await fetch("http://localhost:3000/post/role", {
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
        setFormData(initialFormState);
        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setErrorMsg(errorData.message || `Erreur serveur: ${res.status}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMsg("Impossible de contacter le serveur.");
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
          <button className="delete" type="button" onClick={onClose} aria-label="close"></button>
        </header>
        
        <form onSubmit={handleSubmit}>
          <section className="modal-card-body">
            {errorMsg && (
              <div className="notification is-danger is-light">{errorMsg}</div>
            )}

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

            <hr />
            <label className="label">Permissions du rôle</label>

            <div className="columns is-multiline">
              {Object.keys(labelMapping).map((field) => (
                <div className="column is-6" key={field}>
                  <div className="field">
                    <label className="checkbox">
                      <input 
                        type="checkbox" 
                        name={field} 
                        checked={formData[field]} 
                        onChange={handleChange} 
                      />
                      {' '}{labelMapping[field]}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="modal-card-foot">
            <div className="buttons">
              <button type="submit" className={`button is-primary ${isLoading ? 'is-loading' : ''}`} disabled={isLoading}>
                Créer
              </button>
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
