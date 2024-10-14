// * Add dependencies
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const swaggerUI = require('swagger-ui-express');

const app = express();

const swaggerFile = path.join(__dirname, 'apiSwagger.json');
const swaggerJson = JSON.parse(fs.readFileSync(swaggerFile, 'utf8'));

// * Add models and link to mongo db
const Movies = Models.Movie;
const Users = Models.User;
// NOTE: removed useNewUrlParser and useUnifiedTopology as they are depricated and are set by default
mongoose.connect('mongodb://localhost:27017/movieDB');

// * for creating a log which uses FS
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

// NOTE: this is shorthand for app.use('/', express.static('public'));
app.use(express.static('public'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

//* Adds auth file (must be after bodyparser urlencoded)
// NOTE: the app argument ensures Express is available in the auth.js file
let auth = require('./auth.js')(app); 

//* Adds passport file
const passport = require('passport');
require('./passport.js');

// NOTE: swagger endpoint
app.use('/api_docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));

//! API CALLS BELOW

// * READ HomePage
app.get('/', (req, res) => {
    res.send('Welcome to My Movie App!')
});

// * READ  All movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

// * READ  Movie by title
app.get('/movies/:title', async (req, res) => {
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
app.get('/movies/genres/:genreName', async (req, res) => {
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
app.get('/movies/directors/:directorName', async (req, res) => {
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

// * CREATE  New User
//! We’ll expect JSON in this format
/*{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users.create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) => { res.status(201).json(user) })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
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

app.put('/users/:Username', async (req, res) => {
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
app.post('/users/:Username/movies/:movieID', async (req, res) => {
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
app.delete('/users/:Username/movies/:movieID', async (req, res) => {
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
app.delete('/users/:Username', async (req, res) => {
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

// * error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uhoh... something is broken');
});

app.listen(8080, () => {
    console.log('App is listening to port 8080')
});