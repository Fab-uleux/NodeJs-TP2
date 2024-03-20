const express = require("express");
const path = require("path");
const mustacheExpress = require("mustache-express");
const cors = require("cors");

// ===== INITIALISATION VARIABLES D'ENVIRONNEMENT
require("dotenv").config();

// ===== INITIALISATION DU SERVEUR
const app = express();
const port = process.env.port || 5000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");
app.engine("mustache", mustacheExpress());

//TODO: Expliquer les erreurs CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== MIDDLEWARES
// Ajoute un dossier public pour les fichiers statiques (css, js, images).
// Doit être défini avant les routes
app.use(express.static(path.join(__dirname, "public")));

// ===== ROUTES
// Toutes les routes non statiques doivent être définies après les middlewares
//TODO: Expliquer la division des routes
app.use("/film", require("./routes/film.js"));
app.use("/utilisateur", require("./routes/utilisateur.js"));

// ===== PAGE 404
// Si aucune route n'est trouvée, alors on retourne une erreur 404
app.use((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 404;
    res.json({ message: "Impossible de trouver la ressouces demandée" });
});

// ===== DÉMARRAGE DU SERVEUR
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
