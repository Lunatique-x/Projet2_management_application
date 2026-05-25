const API_URL = "http://localhost:3000";

// Fonction utilitaire pour les headers (évite la répétition)
const getHeaders = () => ({
    "Authorization": `Bearer ${localStorage.getItem('token')}`,
    "Content-Type": "application/json"
});

export const fetchClients = async () => {
    try {
        const res = await fetch(`${API_URL}/allClient`, {
            method: "GET",
            headers: getHeaders()
        });
        if (res.ok) return await res.json();
        return [];
    } catch (error) {
        console.error("Erreur fetchClients:", error);
        return [];
    }
};

export const fetchEmployees = async () => {
    try {
        const res = await fetch(`${API_URL}/allEmploye`, {
            method: "GET",
            headers: getHeaders()
        });
        if (res.ok) return await res.json();
        return [];
    } catch (error) {
        console.error("Erreur fetchEmployees:", error);
        return [];
    }
};

export const fetchVoitures = async () => {
    try {
        const res = await fetch(`${API_URL}/allVoiture`, {
            method: "GET",
            headers: getHeaders()
        });
        if (res.ok) return await res.json();
        return [];
    } catch (error) {
        console.error("Erreur fetchVoitures:", error);
        return [];
    }
};

// Fonction pour MODIFIER une facture
export const updateFacture = async (id, data) => {
    try {
        const res = await fetch(`${API_URL}/put/payements/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res; // On retourne la réponse complète pour gérer le res.ok dans le composant
    } catch (error) {
        console.error("Erreur updateFacture:", error);
        return { ok: false };
    }
};

export const updateEmployee = async (id, data) => {
    try {
        const res = await fetch(`${API_URL}/put/employes/${id}`, {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        return res;
    } catch (error) {
        console.error("Erreur updateEmployee:", error);
        return { ok: false };
    }
};

// Fonction pour SUPPRIMER une facture
export const deleteFacture = async (id) => {
    try {
        const res = await fetch(`${API_URL}/delete/payment/${id}`, {
            method: "DELETE",
            headers: getHeaders()
        });
        return res;
    } catch (error) {
        console.error("Erreur deleteFacture:", error);
        return { ok: false };
    }
};
