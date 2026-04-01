const express = require('express');
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
//un nouvel Employe
// NE PAS UTILISER !!
app.post('/employe', async (req, res) => {
    const { full_name, email, phone, id_role, role_id, password, commission } = req.body;

    if (!password) {
        return res.status(400).json({ message: 'password est requis' });
    }

    try {
        const [id] = await db('employe').insert({
            full_name,
            email,
            phone,
            role_id: role_id ?? id_role,
            password,
            commission
        });
        res.json({ message: 'Employe créé avec succès', id });
    } catch (err) {
        res.status(500).json(err);
    }
});
//un nouveau Payment (vente)
app.post('/payement', async (req, res) => {
    const { id_client, id_voiture, id_employe, date_fin_garantie, prix_vente } = req.body;

    try {
        // 1. Vérifier le client (colonne id_client)
        const clientExists = await db('client').where({ id_client: id_client }).first();
        if (!clientExists) {
            return res.status(404).json({ message: "Le client spécifié n'existe pas" });
        }

        // 2. Vérifier la voiture (colonne id_voiture)
        const voitureExists = await db('voiture').where({ id_voiture: id_voiture }).first();
        if (!voitureExists) {
            return res.status(404).json({ message: "La voiture spécifiée n'existe pas" });
        }

        // 3. Vérifier l'employé (colonne id_employe)
        const employeExists = await db('employe').where({ id_employe: id_employe }).first();
        if (!employeExists) {
            return res.status(404).json({ message: "L'employé spécifié n'existe pas" });
        }

        // 4. Insertion (Assure-toi que les noms de colonnes dans la table 'payement' sont corrects)
        const [id] = await db('payement').insert({
            id_client,
            id_voiture,
            id_employe,
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