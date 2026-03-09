const express = require('express');
const port = 3000;
const db = require('./db');
const app = express.Router();

// On définit la route GET
// recuperer tout Facture
app.get('/allFactures', async (req, res) => {
    console.log("Facture");
    // 2. La requête à la base de données
    try {
        const result = await db('payement').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});


// recuperer tout Client
app.get('/allClient', async (req, res) => {
    console.log("Client");
    try {
        const result = await db('client').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});


// recuperer tout Voiture
app.get('/allVoiture', async (req, res) => {
    console.log("voiture");
    try {
        const result = await db('voiture').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});


// recuperer tout Role
app.get('/allRole', async (req, res) => {
    console.log("role");
    try {
        const result = await db('role').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});


// recuperer tout Employer
app.get('/allEmploye', async (req, res) => {
    console.log("employe");
    try {
        const result = await db('employe').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Récupérer les factures d'un client spécifique via son ID
app.get('/client/:id/factures', async (req, res) => {
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


/*app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
*/
module.exports = app;