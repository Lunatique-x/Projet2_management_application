const express = require('express');
const app = express.Router();
const db = require('./db');
const port = 3000;
const authentifier = require('./commun.js')

//supprimer un Payment
app.delete('/payment/:id', async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Payment WHERE id_payment = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Payment supprimé avec succès', result });
    });
});
// supprimer un Client
app.delete('/client/:id', async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Client WHERE id_client = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Client supprimé avec succès', result });
    });
});
// supprimer une Voiture
app.delete('/voiture/:id', async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Voiture WHERE id_voiture = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Voiture supprimée avec succès', result });
    });
});
// supprimer un Role
app.delete('/role/:id', async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Role WHERE id_role = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Role supprimé avec succès', result });
    });
});
//supprimer un Employe
app.delete('/employe/:id', async (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM Employe WHERE id_employe = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Employe supprimé avec succès', result });
    });
});

module.exports = app;