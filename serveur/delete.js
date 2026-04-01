const express = require('express');
const app = express.Router();
const db = require('./db');
const port = 3000;
const authentifier = require('./commun.js')

//supprimer un Payment
app.delete('/payment/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db('payement').where({ id_payement: id }).del();
        if (result === 0) {
            // Si 0 ligne supprimée, l'ID n'existe pas en base
            return res.status(404).json({ 
                message: "Erreur : Ce paiement n'existe pas ou a déjà été supprimé." 
            });
        }
        res.json({ message: 'Payment supprimé avec succès', result });
    } catch (err) {
        res.status(500).json(err);
    }
});
// supprimer un Client
app.delete('/client/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db('client').where({ id_client: id }).del();
        if (result === 0) {
            // Si 0 ligne supprimée, l'ID n'existe pas en base
            return res.status(404).json({ 
                message: "Erreur : Ce client n'existe pas ou a déjà été supprimé." 
            });
        }
        res.json({ message: 'Client supprimé avec succès', result });
    } catch (err) {
        res.status(500).json(err);
    }
});
// supprimer une Voiture
app.delete('/voiture/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db('voiture').where({ id_voiture: id }).del();
        if (result === 0) {
            // Si 0 ligne supprimée, l'ID n'existe pas en base
            return res.status(404).json({ 
                message: "Erreur : Cette voiture n'existe pas ou a déjà été supprimé." 
            });
        }
        res.json({ message: 'Voiture supprimée avec succès', result });
    } catch (err) {
        res.status(500).json(err);
    }
});
// supprimer un Role
app.delete('/role/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db('role').where({ id_role: id }).del();
        if (result === 0) {
            // Si 0 ligne supprimée, l'ID n'existe pas en base
            return res.status(404).json({ 
                message: "Erreur : Ce role n'existe pas ou a déjà été supprimé." 
            });
        }
        res.json({ message: 'Role supprimé avec succès', result });
    } catch (err) {
        res.status(500).json(err);
    }
});
//supprimer un Employe
app.delete('/employe/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db('employe').where({ id_employe: id }).del();
        if (result === 0) {
            // Si 0 ligne supprimée, l'ID n'existe pas en base
            return res.status(404).json({ 
                message: "Erreur : Cet employe n'existe pas ou a déjà été supprimé." 
            });
        }
        res.json({ message: 'Employe supprimé avec succès', result });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = app;