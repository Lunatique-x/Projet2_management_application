const express = require('express');
const bcrypt = require('bcrypt')
const app = express.Router();
const db = require('./db');
const port = 3000;
const authentifier = require('./commun.js')

//route post
//un nouveau Client
app.post('/client', async (req, res) => {
    const { full_name, email, phone } = req.body;

    try {
        const [id] = await db('client').insert({ full_name, email, phone });
        res.json({ message: 'Client créé avec succès', id });
    } catch (err) {
        res.status(500).json(err);
    }
});
//une nouvelle Voiture
app.post('/voiture', async (req, res) => {
    const { modele, stock, couleur, prix } = req.body;

    try {
        const [id] = await db('voiture').insert({ modele, stock, couleur, prix });
        res.json({ message: 'Voiture créée avec succès', id });
    } catch (err) {
        res.status(500).json(err);
    }
});
//un nouveau Role
app.post('/role', async (req, res) => {
    const { nom, seeStock, modStock, seeClients, modClients, modSell, addClient } = req.body;

    try {
        const [id] = await db('role').insert({ nom, seeStock, modStock, seeClients, modClients, modSell, addClient });
        res.json({ message: 'Role créé avec succès', id });
    } catch (err) {
        res.status(500).json(err);
    }
});
// Route qui permet de crée un Employe
app.post("/employe", async (req, res) => {
    const { full_name, email, password, phone, commission, id_role } = req.body;

    if (!req.body) {
    return res.status(400).json({ message: "Le corps de la requête est vide" });
    }

    // L'email et le password son obligatoire dans la création du compte
    if (!email || !password) {
        return res.status(400).json({ message: "L'Email et le mdp sont requit" })
    }
    try {
        const user = await db('employe').where('email', email).select('*').first();

        if (user) {
            return res.status(400).json({ message: "Utilisateur déjà existant" });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer en base
        await db('employe').insert({ full_name, email, password: hashedPassword, phone, commission, id_role });

        // Réponse
        res.status(201).json({ message: "Compte créé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
})
//un nouveau Payment (vente)
app.post('/payement', async (req, res) => {
    const { client_id, voiture_id, employe_id, date_fin_garantie, prix_vente } = req.body;

    try {
        // 1. Vérifier le client (colonne id_client)
        const clientExists = await db('client').where({ id_client: client_id }).first();
        if (!clientExists) {
            return res.status(404).json({ message: "Le client spécifié n'existe pas" });
        }

        // 2. Vérifier la voiture (colonne id_voiture)
        const voitureExists = await db('voiture').where({ id_voiture: voiture_id }).first();
        if (!voitureExists) {
            return res.status(404).json({ message: "La voiture spécifiée n'existe pas" });
        }

        // 3. Vérifier l'employé (colonne id_employe)
        const employeExists = await db('employe').where({ id_employe: employe_id }).first();
        if (!employeExists) {
            return res.status(404).json({ message: "L'employé spécifié n'existe pas" });
        }

        // 4. Insertion (Assure-toi que les noms de colonnes dans la table 'payement' sont corrects)
        const [id] = await db('payement').insert({
            client_id,
            voiture_id,
            employe_id,
            date_fin_garantie,
            prix_vente
        });

        res.json({ message: 'Payement créé avec succès', id });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});


module.exports = app;