import { useState, useEffect } from "react";

export function ModifierRole({ isOpen, onClose, onRoleModified, role }) {
  // 1. Initialisation alignée sur le composant de création
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
    delSell: false
  };

  // 2. Même dictionnaire pour le rendu dynamique
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
    delSell: "Supprimer une Vente"
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 3. Remplissage des données quand le rôle à modifier change
  useEffect(() => {
    if (role) {
      setFormData({
        nom: role.nom || "",
        viewStock: !!role.viewStock,
        modStock: !!role.modStock,
        addStock: !!role.addStock,
        delStock: !!role.delStock,
        viewClients: !!role.viewClients,
        modClients: !!role.modClients,
        addClient: !!role.addClient,
        delClients: !!role.delClients,
        viewSell: !!role.viewSell,
        addSell: !!role.addSell,
        modSell: !!role.modSell,
        delSell: !!role.delSell
      });
    }
  }, [role, isOpen]);

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
      const res = await fetch(`http://localhost:3000/put/roles/${role.id_role}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        onRoleModified(data);
        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setErrorMsg(errorData.message || `Erreur serveur: ${res.status}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMsg("Impossible de modifier le rôle.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce rôle ?")) return;
    
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`http://localhost:3000/delete/role/${role.id_role}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        const data = await res.json();
        onRoleModified(data);
        onClose();
      } else {
        const errorData = await res.json().catch(() => ({}));
        setErrorMsg(errorData.message || `Erreur serveur: ${res.status}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setErrorMsg("Impossible de supprimer le rôle.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'is-active' : ''}`}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Modifier le rôle</p>
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

            {/* Structure en colonnes identique à CreeRole */}
            <div className="columns is-multiline">
              {Object.keys(labelMapping).map((field) => (
                <div className="column is-6" key={field}>
                  <div className="field">
                    <label className="checkbox">
                      <input 
                        type="checkbox" 
                        name={field} 
                        checked={formData[field] || false} 
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
              <button 
                type="submit" 
                className={`button is-primary ${isLoading ? 'is-loading' : ''}`} 
                disabled={isLoading}
              >
                Modifier
              </button>
              <button 
                type="button" 
                className="button is-danger" 
                onClick={handleDelete} 
                disabled={isLoading}
              >
                Supprimer
              </button>
              <button 
                type="button" 
                className="button" 
                onClick={onClose} 
                disabled={isLoading}
              >
                Annuler
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
