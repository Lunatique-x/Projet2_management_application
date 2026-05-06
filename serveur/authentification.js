const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const app = express();
const port = 3000

//const  db  = require('./db'); V1
const { db } = require('./db');//V2

// app.use(express.json())

// Route qui permet de crée un utilisateur 
app.post("/register", async (req, res) => {
    const { full_name, email, password, phone, commission,role_id } = req.body;// ajout de role.id

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
        await db('employe').insert({ full_name, email, password: hashedPassword, phone, commission,role_id });//ajout de role_id

        // Réponse
        res.status(201).json({ message: "Compte créé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
})

// Route qui permet de créé un token et de retourner un Token
app.post("/token", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "L'Email et le mdp sont requit" })
    }
    try {
        // const user = await db('employe').where('email', email).select('*').first();
// modification de D lier au role
        const user = await db('employe')
        .join('role', 'employe.role_id', 'role.id_role') // Jointure entre les deux tables
        .where('employe.email', email)
        .select(
            'employe.id_employe', 
            'employe.full_name', 
            'employe.email', 
            'employe.password', 
            'role.nom as role_name', // On renomme pour éviter les conflits
            'role.seeStock', 
            'role.modStock', 
            'role.seeClients', 
            'role.modClients', 
            'role.modSell', 
            'role.addClient'
        )
        .first();
//------------------

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
            { id: user.id_employe, email: user.email }, // payload
            "projet2Maisonneuve",                     // clé secrète
            { expiresIn: '9h' }                         // Durée
        );

        // Retourner le token
        //res.json({token: token });
// modification D
        res.json({
        token: token,
        user: {
            id_employe: user.id_employe,
            full_name: user.full_name,
            role_name: user.role_name,
            seeStock: user.seeStock,
            modStock: user.modStock,
            seeClients: user.seeClients,
            modClients: user.modClients,
            modSell: user.modSell,
            addClient: user.addClient
        }
    });
//-----------
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
})

// app.listen(port, () => {
//   console.log(`Serveur lancé sur http://localhost:${port}`);
// });

module.exports = app;