const express = require('express');
const app = express.Router();
const db = require('./db');
const port = 3000;
const authentifier = require('./commun.js')

//route post
//un nouveau Client
app.post('/client', async (req, res) => {
    const { full_name, email, phone } = req.body;
    const sql = "INSERT INTO Client (full_name, email, phone, date_creation) VALUES (?, ?, ?, NOW())";
    
    db.query(sql, [full_name, email, phone], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Client créé avec succès', id: result.insertId });
    });
});
//une nouvelle Voiture
app.post('/voiture', async (req, res) => {
    const { modele, stock, couleur, prix } = req.body;
    const sql = "INSERT INTO Voiture (modele, stock, couleur, prix) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [modele, stock, couleur, prix], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Voiture créée avec succès', id: result.insertId });
    });
});
//un nouveau Role
app.post('/role', async (req, res) => {
    const { nom, commentaire } = req.body;
    const sql = "INSERT INTO Role (nom, commentaire) VALUES (?, ?)";
    
    db.query(sql, [nom, commentaire], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Role créé avec succès', id: result.insertId });
    });
});
//un nouvel Employe
app.post('/employe', async (req, res) => {
    const { full_name, email, phone, id_role } = req.body;
    const sql = "INSERT INTO Employe (full_name, email, phone, id_role, date_creation) VALUES (?, ?, ?, ?, NOW())";
    
    db.query(sql, [full_name, email, phone, id_role], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Employe créé avec succès', id: result.insertId });
    });
});
//un nouveau Payment (vente)
app.post('/payment', async (req, res) => {
    const { id_client, id_voiture, employe, date_fin_garantie, prix_vente } = req.body;
    const sql = "INSERT INTO Payment (id_client, id_voiture, employe, date_fin_garantie, prix_vente, date_creation) VALUES (?, ?, ?, ?, ?, NOW())";
    
    db.query(sql, [id_client, id_voiture, employe, date_fin_garantie, prix_vente], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Payment créé avec succès', id: result.insertId });
    });
});

module.exports = app;