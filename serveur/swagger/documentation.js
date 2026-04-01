const express = require('express');
const app = express();
const port = 8000;
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const authentifier = require('../commun.js');

// 1. Charger le swagger
const swaggerDocument = YAML.load('./swagger/swagger.yaml');

// 2. Middleware pour lire le JSON (À METTRE AVANT LES ROUTES)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. Importation des fichiers de routes
const routesGet = require('../get.js');
const routeAuth = require('../authentification.js');
const routePost = require('../post.js');
const routeDelete = require('../delete.js');
const routePut = require('../put.js');

// 4. Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', routeAuth);
app.use('/', authentifier, routesGet);
app.use('/post',authentifier, routePost);
app.use('/delete',authentifier, routeDelete);
app.use('/put',authentifier, routePut);

app.listen(port, () => {
  console.log(`Documentation disponible sur http://localhost:${port}/api-docs`);
});
