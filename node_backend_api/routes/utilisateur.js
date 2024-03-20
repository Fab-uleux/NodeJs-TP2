const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// /**
//  * @route GET /utilisateurs
//  * @description Cette route permet de récupérer la liste des utilisateurs
//  */
router.get("/utilisateur", async (req, res) => {
    try {
        console.log(req.query);
        const direction = req.query["order-direction"] || "asc";
        const limit = +req.query["limit"] || 100; 

        const donneesRef = await db.collection("utilisateur").orderBy("courriel", direction).limit(limit).get();
        const donneesFinale = [];

        if(donneesRef.size <= 0){
            const donneesTest = require("./data/utilisateurTest.js");

            donneesTest.forEach(async (element) => {
                await db.collection("utilisateur").add(element);
            });

            res.statusCode = 200;

            return res.json({
                message: "DB Utilisateur connecté",
        });
        }

        donneesRef.forEach((doc) => {
            donneesFinale.push(doc.data());
        });

        res.statusCode = 200;
        res.json(donneesFinale);
    } catch (erreur) {
        res.statusCode = 500;
        res.json({ message: "Vous êtes un pas bon, quel utilisateur?" });
    }
});

/**
 * Gère les requêtes GET pour récupérer un utilisateur spécifique par ID.
 */

router.get("/utilisateurs/:id", async (req, res) => {
    try{
        const utilisateurId = req.params.id;

        const donneeRef = await db.collection("utilisateur").doc(utilisateurId).get();

        const donnee = donneeRef.data();

        if (donnee) {
            res.statusCode = 200;
            res.json(donnee);
        } else {
            res.statusCode = 404;
            res.json({ message: "utilisateur non trouvé" });
        }
    }catch (error){
        res.statusCode = 500;
        res.json({ message: "Vous êtes un pas bon, utilisateur non trouvé" });
    }
});


/**
 * @route POST /inscription
 * @description Cette route permet de créer un nouvel utilisateur. Elle vérifie d'abord si l'email fourni est déjà utilisé. Si ce n'est pas le cas, elle crée un nouvel utilisateur avec l'email et le mot de passe fournis, puis renvoie les informations de l'utilisateur avec un token.
 */
router.post(
    "/inscription",
    [
        check("courriel").escape().trim().notEmpty().isEmail().normalizeEmail(),
        check("mdp").escape().trim().notEmpty().isLength({ min: 8, max: 20 }).isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        }),
    ],
    async (req, res) => {
        try {
            const validation = validationResult(req);
            if (!validation.isEmpty()) {
                return res.status(400).json({ message: "Données invalides" });
            }

            const motDePasse = req.body.mdp;
            const courriel = req.body.courriel;

            const docRef = await db.collection("utilisateurs").where("courriel", "==", courriel).get();
            const utilisateurs = [];

            docRef.forEach(async (doc) => {
                utilisateurs.push({ id: doc.id, ...doc.data() });
            });

            if (utilisateurs.length > 0) {
                res.statusCode = 400;
                res.json({ message: "Courriel déjà utilisé" });
            } else {
                //TODO: à ajouter
                const hash = await bcrypt.hash(motDePasse, 10);
                const user = { courriel, mdp: hash };
                const doc = await db.collection("utilisateurs").add(user);
                user.id = doc.id;
                res.json(user);
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
);

/**
 * @route POST /connexion
 * @description Cette route permet à un utilisateur de se connecter. Elle vérifie d'abord si l'email fourni existe dans la base de données. Si c'est le cas, elle compare le mot de passe fourni avec le mot de passe hashé stocké dans la base de données. Si les mots de passe correspondent, elle renvoie les informations de l'utilisateur avec un token.
 */
router.post(
    "/connexion",
    [check("mdp").escape().trim().notEmpty(), check("courriel").escape().trim().notEmpty()],
    async (req, res) => {
        try {
            const validation = validationResult(req);
            if (!validation.isEmpty()) {
                return res.status(400).json({ message: "Données invalides" });
            }
            const motDePasse = req.body.mdp;
            const courriel = req.body.courriel;

            const docRef = await db.collection("utilisateurs").where("courriel", "==", courriel).get();
            const utilisateurs = [];

            docRef.forEach(async (doc) => {
                utilisateurs.push({ id: doc.id, ...doc.data() });
            });

            const utilisateur = utilisateurs[0];

            if (utilisateur === undefined) {
                res.statusCode = 400;
                res.json({ message: "Le courriel n'existe pas" });
            } else {
                const resultatConnexion = await bcrypt.compare(motDePasse, utilisateur.mdp);
                delete utilisateur.mdp;

                if (resultatConnexion) {
                    // Données à passer au front-end sur l'utilisateur
                    const donneesJeton = {
                        courriel:utilisateur.courriel,
                        id: utilisateur.id,
                    };

                    // Options d'expirations
                    const options = {
                        expiresIn: "1d",
                    };

                    //Génération du jeton
                    const jeton = jwt.sign(donneesJeton, process.env.JWT_SECRET, options);

                    res.statusCode = 200;
                    res.json(jeton);
                } else {
                    res.statusCode = 400;
                    res.json({ message: "Mot de passe incorrect" });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
);


/**
 * Gère les requêtes PUT pour mettre à jour les données d'un utilisateur.
 */

router.put("/utilisateur/:id",[
    check("courriel").escape().trim().notEmpty().normalizeEmail(),
    check("mdp").escape().trim().notEmpty().isLength({min:8, max:20}).isStrongPassword({
        minlength:8,
        maxLength:20,
        minLowercase:1,
        minNumbers:1,
        minUppercase:1,
        minSymbols:1
    })
], async (req, res) => {
    try{
        const id = req.params.id;
        const donneesModifiees = req.body;

        await db.collection("utilisateur").doc(id).update(donneesModifiees);

        res.statusCode = 200;
        res.json({ message: "L'utilisateur a été modifiée" });
    }catch (error){
        res.statusCode = 500;
        res.json({ message: "Vous êtes un pas bon qui n'update pas" });
    }
});

/**
 * Gère les requêtes DELETE pour supprimer un utilisateur de la base de données.
 */

router.delete("/utilisateur/:id", async (req, res) => {
    try{
        const id = req.params.id;

        const resultat = await db.collection("utilisateur").doc(id).delete();

        res.statusCode = 200;
        res.json({ message: "L'utilisateur a été supprimé" });
    }catch (error){
        res.statusCode = 500;
        res.json({ message: "Vous êtes un pas bon qui ne delete pas" });
    }    
});

module.exports = router;
