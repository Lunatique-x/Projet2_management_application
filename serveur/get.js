const express = require('express');
const port = 3000;
const db = require('./db');
const app = express.Router();
const jwt = require('jsonwebtoken');

// On définit la route GET
// recuperer tout Facture
app.get('/allFactures',authentifier, async (req, res) => {
    console.log("Facture");
    // 2. La requête à la base de données
    try {
        const result = await db('payement').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});
//recupertaion d'un facture specifique
app.get('/allFactures/:id',authentifier, async (req, res) => {
    const FactureId = req.params.id;
    try {
        const facture = await db('payement')
            .where('id_payement', FactureId)
            .join('client', 'payement.client_id', 'client.id_client')
            .join('voiture', 'payement.voiture_id', 'voiture.id_voiture')
            .join('employe', 'payement.employe_id', 'employe.id_employe')
            .select(
                'payement.*',
                'client.full_name as client_nom',
                'voiture.modele as voiture_modele',
                'employe.full_name as vendeur_nom'
            )
            .first(); // Récupère l'objet directement, pas un tableau

        if (!facture) {
            return res.status(404).json({ message: "Facture introuvable." });
        }

        res.json(facture);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération de la facture" });
    }
});


// recuperer tout Client
app.get('/allClient',authentifier, async (req, res) => {
    console.log("Client");
    try {
        const result = await db('client').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/allClient/:id',authentifier, async (req, res) => {
    const ClientId  = req.params.id;
    try {
        const client = await db('client')
            .where('id_client', ClientId)
            .select(
                'id_client',
                 'full_name', 
                 'email', 'phone',
                  'date_creation'
                )
            .first(); // Récupère l'objet directement, pas un tableau

        if (!client) {
            return res.status(404).json({ message: "Client non trouvé." });
        }

        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération du client" });
    }
});


// recuperer tout Voiture
app.get('/allVoiture',authentifier, async (req, res) => {
    console.log("voiture");
    try {
        const result = await db('voiture').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/allVoiture/:id',authentifier, async (req, res) => {
    const voitureID = req.params.id;
    try {
        const voiture = await db('voiture')
            .where('id_voiture',voitureID)
            .select(
                'id_voiture',
                 'modele', 
                 'stock',
                  'couleur',
                  'prix'
                )
            .first(); // Récupère l'objet directement, pas un tableau

        if (!voiture) {
            return res.status(404).json({ message: "Voiture non trouvé." });
        }

        res.json(voiture);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération du voiture" });
    }
});


// recuperer tout Role
app.get('/allRole',authentifier, async (req, res) => {
    console.log("role");
    try {
        const result = await db('role').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/allRole/:id',authentifier, async (req, res) => {
    const RoleId = req.params.id;
    try {
        const role = await db('role')
            .where('id_role', RoleId)
            .select(
                'id_role',
                 'nom', 
                 'commentaire'

                )
            .first(); // Récupère l'objet directement, pas un tableau

        if (!role) {
            return res.status(404).json({ message: "role non trouvé." });
        }

        res.json(role);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération du voiture" });
    }
});

// recuperer tout Employer
app.get('/allEmploye',authentifier, async (req, res) => {
    console.log("employe");
    try {
        const result = await db('employe').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get('/allEmployee/:id',authentifier, async (req, res) => {
    const EmployeId = req.params.id;
    try {
        const employe = await db('employe')
            .where('id_employe', EmployeId)
            
            .join('role', 'employe.role_id', '=', 'role.id_role')
            .select(
                'employe.id_employe',
                'employe.full_name',
                'employe.email',
                'employe.phone',
                'employe.date_embauche',
                'employe.commission',
                'role.nom as role_nom', 
                'role.commentaire as role_desc'
            )
            .first();
        if (!employe) {
            return res.status(404).json({ message: "employe non trouvé." });
        }

        res.json(employe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération du employe" });
    }
});


// Récupérer les factures d'un client spécifique via son ID
app.get('/client/:id/factures',authentifier, async (req, res) => {
    const clientId = req.params.id;
    console.log(`Récupération des factures pour le client ID: ${clientId}`);

    try {
        // On joint la table 'payement' avec la table 'client'
        const result = await db('payement')
            .where('client_id', clientId)
            .select(
                'payement.*',
                'client.full_name as nom_client',
                'client.email'
            )
            .join('client', 'payement.client_id', 'client.id_client');

        if (result.length === 0) {
            return res.status(404).json({ message: "Aucune facture trouvée pour ce client." });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération" });
    }
});

//verication des tokens
const authentifier = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès interdit : pas de badge !" });
    }

    try {
        // Tu utilises la clé que ton pote a définie dans son fichier
        const payload = jwt.verify(token, "SECRET_KEY");
        req.user = payload; // On stocke les infos de l'utilisateur (id, email)
        next(); // Badge valide ! On laisse passer vers la base de données
    } catch (err) {
        return res.status(403).json({ message: "Badge expiré ou truqué !" });
    }
};


/*app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
*/
module.exports = app;