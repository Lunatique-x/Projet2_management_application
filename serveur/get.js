const express = require('express');
const app = express();
const port = 3000;

// On définit la route GET
// recuperer tout Facture
app.get('/AllFactures', async (req, res) => {
    // 2. La requête à la base de données
    const sql = "SELECT * FROM Facture "; 
    
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        
        // 3. On renvoie tout le résultat
        res.json(result); 
    });
});



// recuperer tout Client
app.get('/AllClient', async (req, res) => {
    // 2. La requête à la base de données
    const sql = "SELECT * FROM Client "; 
    
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        
        // 3. On renvoie tout le résultat
        res.json(result); 
    });
});



// recuperer tout Voiture
app.get('/AllVoiture', async (req, res) => {
    // 2. La requête à la base de données
    const sql = "SELECT * FROM Voiture"; 
    
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        
        // 3. On renvoie tout le résultat
        res.json(result); 
    });
});


// recuperer tout Role
app.get('/AllRole', async (req, res) => {
    // 2. La requête à la base de données
    const sql = "SELECT * FROM Role"; 
    
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        
        // 3. On renvoie tout le résultat
        res.json(result); 
    });
});


// recuperer tout Employer
app.get('/AllEmploye', async (req, res) => {
    // 2. La requête à la base de données
    const sql = "SELECT * FROM Employe"; 
    
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        
        // 3. On renvoie tout le résultat
        res.json(result); 
    });
});


app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});