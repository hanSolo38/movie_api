const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const Models = require('../models.js');
const Users = Models.User;
const { check, validationResult } = require('express-validator');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

const passport = require('passport');
require('../passport.js');

let auth = require('../auth.js')(app); 

// * CREATE  New User
//! We’ll expect JSON in this format
/*{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
router.post('/',
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], async (req, res) => {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        await Users.findOne({ Username: req.body.Username })
            .then((user) => {
                if (user) {
                    return res.status(400).send(req.body.Username + 'already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                    }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
        });

// * UPDATE (PUT)  Update User by username
//! We’ll expect JSON in this format
/*
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
router.put('/:Username', passport.authenticate('jwt', { session: false }), 
    [
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ]
, async (req, res) => {
    
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    //! Condition to check if username matches updated user
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission Denied')
    }
    // End condition

    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set: 
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true }) //NOTE: This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    })
});

// * CREATE  User can add movies to their favoriteMovies by movieID
    //NOTE: Using POST but can also use PUT however, that would delete the other entries
router.post('/:Username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //! Condition to check if username matches updated user
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission Denied')
    }
    // End condition
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $addToSet: { FavoriteMovies: req.params.movieID } //NOTE: Used $addToSet but $push would also work. push adds duplicates
        },
        { new: true }) //NOTE: This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// * DELETE  User can remove movies from their favoriteMovies by movieID
router.delete('/:Username/movies/:movieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //! Condition to check if username matches updated user
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission Denied')
    }
    // End condition
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.movieID }
        },
        { new: true }) //NOTE: This line makes sure that the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

// * DELETE Remove user by username
router.delete('/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    //! Condition to check if username matches updated user
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission Denied')
    }
    // End condition
    await Users.findOneAndDelete({ Username: req.params.Username })  //NOTE: used findOneAndDelete vs findOneAndRemove (remove isn't recognized in newer mongoose)
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

module.exports = router