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

// NOTE: swagger endpoint
app.use('/api_docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));

// DEPRECATED:
// In-memory arrays
    //replaced with mongo db
    // let users = [
    //     {
    //         id: 1,
    //         name: 'Jonathan',
    //         favoriteMovies: []
    //     },
    //     {
    //         id: 2,
    //         name: 'Esther',
    //         favoriteMovies: ['Hamilton']
    //     },
    //     {
    //         id: 3,
    //         name: 'Lydia',
    //         favoriteMovies: ['The Notebook']
    //     }
    // ];

    // let topMovies = [
    //     {
    //         title: 'Monty Python and the Holy Grail',
    //         release_date: 1975,
    //         genre: {
    //             name: 'Comedy',
    //             description: 'The comedy genre in film is characterized by its focus on humor and entertainment, often exploring the absurdities of life and relationships through witty dialogue, relatable characters, and light-hearted situations.'
    //         },
    //         directors: [
    //             {
    //                 name: 'Terry Gilliam',
    //                 bio: 'Terry Gilliam was born near Medicine Lake, Minnesota. When he was 12 his family moved to Los Angeles where he became a fan of MAD magazine. In his early twenties he was often stopped by the police who suspected him of being a drug addict and Gilliam had to explain that he worked in advertising. In the political turmoil in the 60\'s, Gilliam feared he would become a terrorist and decided to leave the USA. He moved to England and landed a job on the children\'s television show Do Not Adjust Your Set (1967) as an animator. There he met meet his future collaborators in Monty Python: Terry Jones, Eric Idle and Michael Palin. In 2006 he renounced his American citizenship.'
    //             }, 
    //             {
    //                 name: 'Terry Jones',
    //                 bio: 'Terry Jones was a Welsh director, actor, and writer, best known as a founding member of the iconic comedy group Monty Python. Born on February 1, 1942, in Cardiff, Wales, he gained fame for his role in creating and directing many of the group\'s classic works, including the films Monty Python and the Holy Grail and Life of Brian. Jones was celebrated for his unique comedic style, blending absurdity with sharp wit. In addition to his work in film, he was a talented author and historian, contributing to various projects on medieval history. Jones continued to influence comedy until his passing on January 21, 2020, leaving behind a legacy of laughter and creativity.'
    //             }
    //         ],
    //         writers: ['Graham Chapman', 'John Cleese', 'Eric Idle'],
    //         stars: ['Graham Chapman', 'John Cleese', 'Eric Idle'],
    //         imdb_link: 'https://www.imdb.com/title/tt0071853/'
    //     },
    //     {
    //         title: 'Young Frankenstein',
    //         release_date: 1974,
    //         genre: {
    //             name: 'Comedy',
    //             description: 'The comedy genre in film is characterized by its focus on humor and entertainment, often exploring the absurdities of life and relationships through witty dialogue, relatable characters, and light-hearted situations.'
    //         },
    //         directors: [
    //             {
    //                 name: 'Mel Brooks',
    //                 bio: 'Mel Brooks is an acclaimed American filmmaker, comedian, and actor, born on June 28, 1926, in Brooklyn, New York. Known for his sharp wit and satirical humor, he gained fame in the 1970s with iconic films such as Blazing Saddles, Young Frankenstein, and The Producers, the latter winning him an Academy Award for Best Original Screenplay. Brooks is celebrated for his ability to blend comedy with social commentary, often parodying popular genres and classic films. With a career spanning over six decades, he has left an indelible mark on the world of comedy, earning numerous accolades, including the EGOT (Emmy, Grammy, Oscar, and Tony) status. His unique style continues to inspire generations of comedians and filmmakers.'
    //             }
    //         ],
    //         writers: ['Gene Wilder', 'Mel Brooks', 'Mary Shelley'],
    //         stars: ['Gene Wilder', 'Madeline Kahn', 'Marty Feldman'],
    //         imdb_link: 'https://www.imdb.com/title/tt0072431/'
    //     },
    //     {
    //         title: 'Spies Like Us',
    //         release_date: 1985,
    //         genre: {
    //             name: 'Comedy',
    //             description: 'The comedy genre in film is characterized by its focus on humor and entertainment, often exploring the absurdities of life and relationships through witty dialogue, relatable characters, and light-hearted situations.'
    //         },
    //         directors: [
    //             {
    //                 name: 'John Landis',
    //                 bio: 'John Landis is an influential American filmmaker, screenwriter, and producer, born on August 3, 1950, in Chicago, Illinois. He is best known for his work in the comedy and horror genres, directing iconic films such as Animal House, The Blues Brothers, An American Werewolf in London, and Coming to America. Landis gained acclaim for his unique ability to blend humor with horror, particularly in An American Werewolf in London, which won him an Academy Award for Best Makeup. With a career spanning over five decades, he has also worked on numerous music videos and television shows, including the groundbreaking series Thriller by Michael Jackson. Landis is recognized for his significant contributions to cinema and his impact on popular culture.'
    //             }
    //         ],
    //         writers: ['Dan Aykroyd', 'Dave Thomas', 'Lowell Ganz'],
    //         stars: ['Chevy Chase', 'Dan Aykroyd', 'Mark Stewart'],
    //         imdb_link: 'https://www.imdb.com/title/tt0090056/'
    //     },
    //     {
    //         title: 'Star Wars: Episode IV - A New Hope',
    //         release_date: 1977,
    //         genre: {
    //             name: 'Science Fiction',
    //             description: 'A sci-fi movie is a genre that explores imaginative and futuristic concepts, often involving advanced technology, space exploration, time travel, parallel universes, or extraterrestrial life, while examining the impact of these elements on society and the human experience.'
    //         },
    //         directors: [
    //             {
    //                 name: 'George Lucas',
    //                 bio: 'George Lucas is a pioneering American filmmaker and entrepreneur, born on May 14, 1944, in Modesto, California. He is best known for creating the legendary Star Wars franchise and the Indiana Jones series, revolutionizing the science fiction and adventure genres. Lucas founded Lucasfilm, where he developed groundbreaking special effects technologies that transformed filmmaking, including the creation of Industrial Light & Magic (ILM). His innovative storytelling and visionary world-building have had a lasting impact on cinema, earning him critical acclaim and numerous awards. In addition to directing, he has served as a producer and writer, shaping the landscape of modern film. Lucas is also known for his philanthropic efforts, including initiatives in education and the arts.'
    //             }
    //         ],
    //         writers: ['George Lucas'],
    //         stars: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher'],
    //         imdb_link: 'https://www.imdb.com/title/tt0076759/'
    //     },
    //     {
    //         title: 'Garden State',
    //         release_date: 2004,
    //         genre: {
    //             name: 'Dramedy',
    //             description: 'A dramedy is a film or television genre that combines elements of drama and comedy, blending humorous moments with serious themes to create a nuanced portrayal of real-life situations and relationships.'
    //         },
    //         directors: [
    //             {
    //                 name: 'Zach Braff',
    //                 bio: 'Zach Braff is an American actor, director, and screenwriter, born on April 6, 1975, in South Orange, New Jersey. He gained widespread recognition for his role as J.D. in the hit television series Scrubs, which showcased his unique blend of humor and emotional depth. Braff made his directorial debut with the critically acclaimed film Garden State in 2004, which he also wrote and starred in, earning praise for its authentic portrayal of relationships and mental health. He continued to explore themes of personal growth and self-discovery in his subsequent films, including Wish I Was Here and Going in Style. Known for his creative storytelling and distinctive voice, Braff has made significant contributions to both television and film, resonating with audiences across generations.',
    //             }
    //         ],
    //         writers: ['Zach Braff'],
    //         stars: ['Zach Braff', 'Peter Sarsgaard', 'Natalie Portman'],
    //         imdb_link: 'https://www.imdb.com/title/tt0333766/'
    //     },
    //     {
    //         title: 'The Terminal',
    //         release_date: 2004,
    //         genre: {
    //             name: 'Comedy-Drama',
    //             description: 'Comedy-drama is a genre that merges comedic and dramatic elements, balancing humor with emotional depth to explore complex characters and situations, often highlighting the nuances of human relationships and life experiences.'
    //         },
    //         directors: [
    //             {
    //                 name: 'Steven Spielberg',
    //                 bio: 'Steven Spielberg is a legendary American filmmaker, producer, and screenwriter, born on December 18, 1946, in Cincinnati, Ohio. Renowned for his groundbreaking work in cinema, he has directed some of the most iconic films in history, including Jaws, E.T. the Extra-Terrestrial, Jurassic Park, and Schindler\'s List, the latter winning him an Academy Award for Best Director. Spielberg is celebrated for his ability to blend genres, combining elements of adventure, science fiction, and historical drama, while often exploring themes of childhood, family, and human resilience. Co-founder of DreamWorks Studios, he has also produced numerous influential films and television series, shaping modern cinema. With a career spanning over five decades, Spielberg\'s impact on the film industry is unparalleled, making him one of the most influential filmmakers of all time.'
    //             }
    //         ],
    //         writers: ['Andrew Niccol', 'Sacha Gervasi', 'Jeff Nathanson'],
    //         stars: ['Tom Hanks', 'Catherine Zeta-Jones', 'Chi McBride'],
    //         imdb_link: 'https://www.imdb.com/title/tt0362227/'
    //     },
    //     {
    //         title: 'Catch Me If You Can',
    //         release_date: 2002,
    //         genre: {
    //             name: 'Biographical Crime Drama',
    //             description: 'A biographical crime drama is a genre that portrays the true story of an individual involved in criminal activities, combining factual elements with dramatic storytelling to explore the motivations, consequences, and complexities of their actions.'
    //         },
    //         directors: [
    //             {
    //                 name: 'Steven Spielberg',
    //                 bio: 'Steven Spielberg is a legendary American filmmaker, producer, and screenwriter, born on December 18, 1946, in Cincinnati, Ohio. Renowned for his groundbreaking work in cinema, he has directed some of the most iconic films in history, including Jaws, E.T. the Extra-Terrestrial, Jurassic Park, and Schindler\'s List, the latter winning him an Academy Award for Best Director. Spielberg is celebrated for his ability to blend genres, combining elements of adventure, science fiction, and historical drama, while often exploring themes of childhood, family, and human resilience. Co-founder of DreamWorks Studios, he has also produced numerous influential films and television series, shaping modern cinema. With a career spanning over five decades, Spielberg\'s impact on the film industry is unparalleled, making him one of the most influential filmmakers of all time.'
    //             }
    //         ],
    //         writers: ['Frank Abagnale Jr.', 'Stan Redding', 'Jeff Nathanson'],
    //         stars: ['Leonardo DiCaprio', 'Tom Hanks', 'Christopher Walken'],
    //         imdb_link: 'https://www.imdb.com/title/tt0264464/'
    //     },
    // ];
/* end comment */

// * READ HomePage
app.get('/', (req, res) => {
    res.send('Welcome to My Movie App!')
});

// DEPRECATED:
// Old callback for inmemory data
// app.get('/movies', (req, res) => {
//     res.status(200).json(topMovies);
// });
/* end comment */

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

// DEPRECATED:
// app.get('/movies/:title', (req, res) => {
//     //old method: const title = req.params.title;
//     const { title } = req.params;
//     const movie = topMovies.find( movie => movie.title === title);

//     if (movie) {
//         res.status(200).json(movie);
//     } else {
//         res.status(400).send('Movie Not Found')
//     }

// })
/* end comment */

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

// DEPRECATED:
// app.get('/movies/genre/:genreName', (req, res) => {
//     const { genreName } = req.params;
//     const genre = topMovies.find( movie => movie.genre.name === genreName).genre;

//     if (genre) {
//         res.status(200).json(genre);
//     } else {
//         res.status(400).send('No such genre')
//     }

// })
/* end comment */

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

// DEPRECATED:
    // the default method from class only works if director values are not in an array. the applied method is needed to search the array itself.
    // app.get('/movies/directors/:directorName', (req, res) => {
    //     const { directorName } = req.params;
    //     const director = topMovies.find( movie => movie.directors.name === directorName).directors;

    //     if (director) {
    //         res.status(200).json(director);
    //     } else {
    //         res.status(400).send('No such director')
    //     }

    // })
/* end comment */

// DEPRECATED:
// app.get('/movies/directors/:directorName', (req, res) => {
//     const { directorName } = req.params;

//      //Find the movie that contains the director
//     const movie = topMovies.find(movie => 
//         movie.directors.some(director => director.name === directorName)
//     );

//     if (movie) {
//         // Find the specific director's information
//         const director = movie.directors.find(director => director.name === directorName);
//         res.status(200).json(director);
//     } else {
//         res.status(400).send('No such director');
//     }
// })
/* end comment */

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

// DEPRECATED:
// * CREATE (POST) 
    // NOTE: req.body only usable due to bodyparser
// app.post('/users', (req, res) => {
//     const newUser = req.body;

//     if (newUser.name) {
//         newUser.id = uuid.v4();
//         users.push(newUser);
//         res.status(201).json(newUser)
//     } else {
//         res.status(400).send('Users need names')
//     }
// })
/* end comment */

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

// DEPRECATED:
// * UPDATE (PUT)
// app.put('/users/:id', (req, res) => {
//     const { id } = req.params;
//     const updatedUser = req.body;

//     // NOTE: use let vs const to update and == vs === because of the string vs number. you can also cast to string as well
//     let user = users.find(user => user.id == id);

//     if (user) {
//         user.name = updatedUser.name;
//         res.status(200).json(user);
//     } else {
//         res.status(400).send('User not found')
//     }

// })
/* end comment */

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


// DEPRECATED:
// * CREATE (POST but can also be UPDATE/PUT but will delete other data there)
// app.post('/users/:id/:movieTitle', (req, res) => {
//     const { id, movieTitle } = req.params;

//     // NOTE: use let vs const to update and == vs === because of the string vs number. you can also cast to string as well
//     let user = users.find(user => user.id == id);

//     if (user) {
//         user.favoriteMovies.push(movieTitle);
//         res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
//     } else {
//         res.status(400).send('User not found')
//     }

// })
/* end comment */

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

// DEPRECATED:
// * DELETE
// app.delete('/users/:id/:movieTitle', (req, res) => {
//     const { id, movieTitle } = req.params;

//     // NOTE: use let vs const to update and == vs === because of the string vs number. you can also cast to string as well
//     let user = users.find(user => user.id == id);

//     if (user) {
//         user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle)
//         res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
//     } else {
//         res.status(400).send('User not found')
//     }

// })
/* end comment */

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

//DEPRECATED:
// * DELETE
// app.delete('/users/:id', (req, res) => {
//     const { id } = req.params;

//     // NOTE: use let vs const to update and == vs === because of the string vs number. you can also cast to string as well
//     let user = users.find(user => user.id == id);

//     if (user) {
//         users = users.filter(user => user.id != id)
//         res.status(200).send(`User ${id} has been deleted`);
//     } else {
//         res.status(400).send('User not found')
//     }

// })
/* end comment */

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