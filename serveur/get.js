const express = require('express');
const port = 3000;
//const  db  = require('./db'); V1
const { db } = require('./db');//V2
const fs = require('fs');
const path = require('path');
const app = express.Router();
const jwt = require('jsonwebtoken');
const authentifier = require('./commun')

// On définit la route GET

// Cette route permet de récupérer toutes les factures avec les noms complets
app.get('/allFactures', async (req, res) => {
    console.log("Récupération des factures avec détails...");
    try {
        const result = await db('payement')
            // Jointure avec la table client
            .join('client', 'payement.client_id', '=', 'client.id_client')
            // Jointure avec la table voiture
            .join('voiture', 'payement.voiture_id', '=', 'voiture.id_voiture')
            // Jointure "left" avec employé (au cas où l'employé_id est null)
            .leftJoin('employe', 'payement.employe_id', '=', 'employe.id_employe')
            .select(
                'payement.*',                 // Toutes les colonnes de la facture
                'client.full_name as client_nom',   // Le nom du client
                'voiture.modele as voiture_modele', // Le modèle de la voiture
                'employe.full_name as employe_nom'  // Le nom de l'employé
            );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des factures" });
    }
});
//Cette route permet de recuper une facture specifique selon id de la facture
app.get('/allFactures/:id', async (req, res) => {
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
            .first();

        if (!facture) {
            return res.status(404).json({ message: "Facture introuvable." });
        }

        res.json(facture);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération de la facture" });
    }
});


// cette route permet recuperer tout les Client
app.get('/allClient', async (req, res) => {
    console.log("Client");
    try {
        const result = await db('client').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

//cette route permet recuperer un client specifique selon id du client
app.get('/allClient/:id', async (req, res) => {
    const ClientId  = req.params.id;
    try {
        const client = await db('client')
            .where('id_client', ClientId)
            .select(
                'id_client',
                'full_name', 
                'email',
                'phone',
                'pdf_path',
                'date_creation'
            )
            .first(); 
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé." });
        }

        res.json(client);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération du client" });
    }
});

// Route pour télécharger le PDF d'un client spécifique
app.get('/client/:id/download-pdf', async (req, res) => {
    const clientId = req.params.id;

    try {
        // Chercher le chemin du PDF en base de données
        const client = await db('client')
            .where('id_client', clientId)
            .select('pdf_path', 'full_name')
            .first();

        // Vérifier si le client existe
        if (!client) {
            return res.status(404).json({ message: "Client non trouvé." });
        }

        // Vérifier si ce client possède un PDF
        if (!client.pdf_path) {
            return res.status(404).json({ message: "Ce client n'a pas de fichier PDF associé." });
        }

        // Construire le chemin absolu du fichier sur le serveur
        const absolutePath = path.resolve(client.pdf_path);

        // Vérifier si le fichier existe physiquement sur le disque
        if (!fs.existsSync(absolutePath)) {
            return res.status(404).json({ message: "Le fichier PDF est introuvable sur le serveur." });
        }

        // Optionnel : Nettoyer le nom du client pour le fichier téléchargé
        const safeFileName = `${client.full_name.replace(/[^a-z0-9]/gi, '_')}.pdf`;

        // Déclencher le téléchargement chez l'utilisateur
        res.download(absolutePath, safeFileName);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors du téléchargement du PDF." });
    }
});

// Cette route permet de recuperer tout les voitures
app.get('/allVoiture', async (req, res) => {
    console.log("voiture");
    try {
        const result = await db('voiture').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});
// Cette route permet de recuperer une voiture specifique selon id de la voiture
app.get('/allVoiture/:id', async (req, res) => {
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
            .first(); 
        if (!voiture) {
            return res.status(404).json({ message: "Voiture non trouvé." });
        }

        res.json(voiture);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération du voiture" });
    }
});


//Cette route permet de recuperer tout les Role
app.get('/allRole', async (req, res) => {
    console.log("role");
    try {
        const result = await db('role').select('*');
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});
//Cette route permet de recuperer un role specifique selon id du role
app.get('/allRole/:id', async (req, res) => {
    const RoleId = req.params.id;
    try {
        const role = await db('role')
            .where('id_role', RoleId)
            .select(
                'id_role', 
                'nom', 
                'seeStock',
                'seeClients', 
                'modStock',
                'modClients',
                'modSell',
                'addClient'

                )
            .first(); 

        if (!role) {
            return res.status(404).json({ message: "role non trouvé." });
        }

        res.json(role);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération du role" });
    }
});

// cette route permet de recuperer tout les employes
app.get('/allEmploye', async (req, res) => {
    console.log("employe");
    try {
        const result = await db('employe')
            .leftJoin('role', 'employe.role_id', '=', 'role.id_role')
            .select(
                'employe.*',
                'role.nom as role_nom'
            );
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});
// cette route permet de recuperer un employe sepcifique selon id de employe
app.get('/allEmploye/:id', async (req, res) => {
    const employeId = req.params.id;
    try {
        const employe = await db('employe')
            .leftJoin('role', 'employe.role_id', '=', 'role.id_role')
            .where('employe.id_employe', employeId)
            .select(
                'employe.id_employe',
                'employe.full_name',
                'employe.email',
                'employe.phone',
                'employe.date_embauche',
                'employe.commission',
                'role.nom as role_nom'
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


// Cette route permet de recuper les factures d'un client selon id du client
app.get('/client/:id/factures', async (req, res) => {
    const clientId = req.params.id;
    console.log(`Récupération des factures pour le client ID: ${clientId}`);

    try {
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