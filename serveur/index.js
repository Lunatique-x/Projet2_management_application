const express = require('express');
const app = express(); // Ici on crée l'application principale
const port = 3000;
const routes = require('./get.js'); // Importe ton fichier de routes (adapte le nom)

// Optionnel mais recommandé pour lire le JSON plus tard
app.use(express.json());

// Utilise tes routes
app.use('/', routes);

// Lance le serveur
app.listen(port, () => {
  console.log(` Serveur actif sur http://localhost:${port}`);
});