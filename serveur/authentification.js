const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')

const { db } = require('./db')
const app = express()

app.post("/auth/register", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "L'Email et le mdp sont requit" })
    }
    try {
        const user = await db.get("SELECT * FROM users WHERE email = ?", [email])

        if (user) {
            return res.status(400).json({ message: "Utilisateur déjà existant" });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insérer en base
        await db.run(
            "INSERT INTO users (email, password) VALUES (?, ?)",
            [email, hashedPassword]
        );

        // Réponse
        res.status(201).json({ message: "Compte créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
})


app.post("/auth/token", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "L'Email et le mdp sont requit" })
    }
    try {
        const user = await db.get("SELECT * FROM users WHERE email = ?", [email])
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
        res.json({ token });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
})

export default app