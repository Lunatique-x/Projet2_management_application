const express = require('express');
const cors = require('cors');;
const app = express(); // Ici on crée l'application principale
const port = 3000;
const path = require('path')
const multer = require('multer');
//const routesGet = require('./get.js'); // Importation des routes gets
//const routeAuth = require('./authentification.js') // Importation des routes authentifications
//const routePost = require('./post.js') // Importation des routes posts
//const routeDelete = require('./delete.js') // Importation des routes deletes
//const routePut = require('./put.js'); // Importation des Puts
//const authentifier = require('./commun.js');
const { initializeDatabase } = require('./db');

// Configuration du stockage de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'DocumentPDF/'); // Les fichiers iront dans ce dossier
    },
    filename: (req, file, cb) => {
        // Génère un nom unique pour éviter les doublons (Ex: 171684321-rapport.pdf)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
// Filtrer pour n'accepter que les PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers PDF sont autorisés !'), false);
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });
// Optionnel mais recommandé pour lire le JSON plus tard
app.use(express.json());
app.use(cors());

// app.use('/auth', routeAuth);
// app.use('/', authentifier, routesGet);
// app.use('/post',authentifier, routePost);
// app.use('/delete',authentifier, routeDelete);
// app.use('/put',authentifier, routePut);

// Utilise tes routes
// app.use(express.static(path.join(__dirname, "../Client")));

// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "../Client", "index.html"))
// })

// Lance le serveur après l'initialisation de la base de données
// initializeDatabase()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Serveur actif sur http://localhost:${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Impossible d\'initialiser la base de données :', error);
//     process.exit(1);
//   });

//V2
initializeDatabase()
  .then(() => {
    // MAINTENANT on importe les routes, une fois que la DB est prête
    const routeAuth = require('./authentification.js');
    const routesGet = require('./get.js');
    const routePost = require('./post.js');
    const routeDelete = require('./delete.js');
    const routePut = require('./put.js');
    const authentifier = require('./commun.js');

    // On les utilise
    app.use('/auth', routeAuth);
    app.use('/', authentifier, routesGet);
    app.use('/post', authentifier, routePost);
    app.use('/delete', authentifier, routeDelete);
    app.use('/put', authentifier, routePut);

    app.listen(port, () => {
      console.log(` Base de données prête et serveur actif sur http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(' Erreur critique :', error);
    process.exit(1);
  });

module.exports = { upload };