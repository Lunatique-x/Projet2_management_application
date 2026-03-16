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
    const { nom, commentaire } = req.body;

    try {
        const [id] = await db('role').insert({ nom, commentaire });
        res.json({ message: 'Role créé avec succès', id });
    } catch (err) {
        res.status(500).json(err);
    }
});
//un nouvel Employe
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
app.post('/payment', async (req, res) => {
    const { id_client, id_voiture, employe, employe_id, date_fin_garantie, prix_vente } = req.body;

    try {
        const [id] = await db('payement').insert({
            client_id: id_client,
            voiture_id: id_voiture,
            employe_id: employe_id ?? employe,
            date_fin_garantie,
            prix_vente
        });
        res.json({ message: 'Payment créé avec succès', id });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = app;