const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const auth = require("../middlewares/auth.js");
const { check, validationResult } = require("express-validator");

/**
 * Cette route permet d'initialiser la base de données avec des données de test
 * @route POST /films/initialize
 */
router.post("/initialize", async (req, res) => {
    const donneesTest = require("../data/filmsDepart.js");
    donneesTest.forEach(async (film) => {
        await db.collection("films").add(film);
    });

    res.statusCode = 200;
    res.json({ message: "Données initialisées" });
});


/**
 * Cette route permet de récupérer la liste des films
 * @route GET /films
 */
router.get("/", async (req, res) => {

    try {
        const tri = req.query.tri || "titre";
        const direction = req.query["order-direction"] || "asc";

        if (tri == "titre" || tri == "realisation" || tri == "annee" && direction == "asc" || direction == "desc") {
            const donneesRef = await db.collection("film").orderBy(tri, direction).limit(50).get();
            const donneesFinale = [];

            // if(donneesRef.size <= 0){
            //         const donneesTest = require("./data/filmsTest.js");
            
            //         donneesTest.forEach(async (element) => {
            //             await db.collection("film").add(element);
            //         });
            
            //         return res.json({
            //             message: "DB Film connecté",
            //         });
            // }

            donneesRef.forEach((doc) => {
                donneesFinale.push({ id:doc.id,...doc.data()});
            });

            res.statusCode = 200;
            res.json(donneesFinale);
        }
        

    } catch (erreur) {
        res.statusCode = 500;
        res.json({ message: "Vous êtes un pas bon, quel film?" });
    }
});

/**
 * Cette route permet de récupérer un film
 * @route GET /films/{id}
 */
router.get("/:id", async (req, res) => {
    try{
        const filmId = req.params.id;

        const donneeRef = await db.collection("film").doc(filmId).get();

        const donnee = donneeRef.data();

        if (donnee) {
            res.statusCode = 200;
            res.json(donnee);
        } else {
            res.statusCode = 404;
            res.json({ message: "film non trouvé" });
        }
    }catch (error){
        res.statusCode = 500;
        res.json({ message: "Vous êtes un pas bon, film non trouvé" });
    }
    
});

/**
 * Cette route permet d'initialiser la base de données avec des données de test
 * @route POST /films/initialize
 */
// router.post("/initialize", async (req, res) => {
//     const donneesTest = require("../data/filmsDepart.js");
//     donneesTest.forEach(async (film) => {
//         await db.collection("films").add(film);
//     });

//     res.statusCode = 200;
//     res.json({ message: "Données initialisées" });
// });

/**
 * Cette route permet de créer un film
 * @route POST /films
 */
router.post(
    "/",
    [
        check("titre").escape().trim().notEmpty().isString(),
        check("genres").escape().trim().exists().isArray(),
        check("description").escape().trim().notEmpty().isString(),
        check("titreVignette").escape().trim().notEmpty().isString(),
        check("realisation").escape().trim().notEmpty().isString(),
        check("annee").escape().trim().notEmpty().isString(),
    ],
    async (req, res) => {
        try {
            const validation = validationResult(req);
            if (!validation.isEmpty()) {
                return res.status(400).json({ message: "Données invalides", errrors: validation.array() });
            }

            const film = req.body;
            const doc = await db.collection("films").add(film);
            film.id = doc.id;
            res.json(film);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }
);

/**
 * Cette route permet de modifier un film
 * @route PUT /films/{id}
 */
router.put("/:id",[
    check("annee").escape().trim().notEmpty(),
    check("description").escape().trim().notEmpty(),
    check("genres").escape().trim().notEmpty(),
    check("realisation").escape().trim().notEmpty(),
    check("titre").escape().trim().notEmpty(),
    check("titreVignette").escape().trim().notEmpty(),
], async (req, res) => {
    try{
        const id = req.params.id;
        const donneesModifiees = req.body;

        await db.collection("film").doc(id).update(donneesModifiees);

        res.statusCode = 200;
        res.json({ message: "Le film a été modifiée" });
    }catch (error){
        res.statusCode = 500;
        res.json({ message: "Vous êtes un pas bon qui n'update pas" });
    }
});

/**
 * Cette route permet de supprimer un film
 * @route DELETE /films/{id}
 */
router.delete("/:id", auth, async (req, res) => {
    try{
        const id = req.params.id;

        const resultat = await db.collection("film").doc(id).delete();

        res.statusCode = 200;
        res.json({ message: "Le film a été supprimé" });
    }catch (error){
        res.statusCode = 500;
        res.json({ message: "Vous êtes un pas bon qui ne delete pas" });
    }    
});


module.exports = router;
