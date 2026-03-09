const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const app = express();
const port = 3000

const db = require('./db')

app.use(express.json())

app.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;

    if (!req.body) {
    return res.status(400).json({ message: "Le corps de la requête est vide" });
    }

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
        await db('employe').insert({ email, password: hashedPassword });

        // Réponse
        res.status(201).json({ message: "Compte créé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
})


app.post("/auth/token", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "L'Email et le mdp sont requit" })
    }
    try {
        const user = await db('employe').where('email', email).select('*').first();
        if (!user) {
            return res.status(401).json({ message: "Utilisateur introuvable" });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Générer le token
        const token = jwt.sign(
            { id: user.id, email: user.email }, // payload
            "SECRET_KEY"                        // clé secrète
        );

        // Retourner le token
        res.json({token: token });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
})

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
//module.exports = app;