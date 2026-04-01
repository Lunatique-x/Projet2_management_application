const express = require('express');
const app = express(); // Ici on crée l'application principale
const port = 3000;
const path = require('path')
const routesGet = require('./get.js'); // Importation des routes gets
const routeAuth = require('./authentification.js') // Importation des routes authentifications
const routePost = require('./post.js') // Importation des routes posts
const routeDelete = require('./delete.js') // Importation des routes deletes
const routePut = require('./put.js') // Importation des Puts

// Optionnel mais recommandé pour lire le JSON plus tard
app.use(express.json());

app.use('/get', routesGet);
app.use('/auth', routeAuth);
app.use('/posts', routePost);
app.use('/delete', routeDelete);
app.use('/put', routePut);

// Utilise tes routes
// app.use(express.static(path.join(__dirname, "../Client")));

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../Client", "index.html"))
// })

// Lance le serveur
app.listen(port, () => {
  console.log(` Serveur actif sur http://localhost:${port}`);
});