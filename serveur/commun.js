const express = require('express');
const app = express();
const path = require('path')
const routesGet = require('./get.js'); // Importation des routes get

app.use('/', routesGet); // Utilisation avec un préfixe

app.listen(3000);