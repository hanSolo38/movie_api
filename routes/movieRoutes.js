const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const Models = require('../models.js');
const Movies = Models.Movie;
const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

const passport = require('passport');
require('../passport.js');

let auth = require('../auth.js')(app); 


// * READ  All movies
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// * READ  Movie by title
router.get('/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ title: req.params.title})
        .then((movie) => {
            //added a message for movies not found in DB
            if (!movie) {
                return res.status(404).send('Movie Not Found (the title is case sensitive)');
            }
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// * READ  Genre by name
router.get('/genres/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne(
        { "genre.name": req.params.genreName},
        { genre: 1, _id: 0 }
    )
        .then((genre) => {
            res.json(genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

// * READ  Director by name
router.get('/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne(
        { "director.name": req.params.directorName},
        { director: 1, _id: 0 }
    )
        .then((director) => {
            res.json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        })
});

module.exports = router;