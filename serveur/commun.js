const jwt = require('jsonwebtoken')
const JWT_SECRET = "projet2Maisonneuve";

/**
 * Middleware d'authentification
 */
const authentifier = (req, res, next) => {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers['authorization'];
    
    // 2. Extraire le token (Format: "Bearer <token>")
    const token = authHeader && authHeader.split(' ')[1];

    // 3. Si aucun token n'est présent -> Dehors !
    if (!token) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    try {
        // 4. Vérification de la signature avec notre clé secrète
        const userDecoded = jwt.verify(token, JWT_SECRET);

        // 5. FEU VERT : On attache les infos de l'utilisateur à la requête 
        // pour que la route suivante sache qui parle.
        req.user = userDecoded;

        // 6. On passe à la suite !
        next();

    } catch (err) {
        // 7. Badge falsifié ou expiré -> Erreur
        return res.status(403).json({ message: "Token invalide ou expiré." });
    }
};

module.exports = authentifier;