const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');

const app = express();

//creating a log
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

//this is shorthand for app.use('/', express.static('public'));
app.use(express.static('public'));

// default names for topMovies (use arrays for directors, writers, stars)
// title:
// release_date:
// directors:
// writers:
// stars:
// imdb_link:

let topMovies = [
    {
        title: 'Monty Python and the Holy Grail',
        release_date: 1975,
        directors: ['Terry Gilliam', 'Terry Jones'],
        writers: ['Graham Chapman', 'John Cleese', 'Eric Idle'],
        stars: ['Graham Chapman', 'John Cleese', 'Eric Idle'],
        imdb_link: 'https://www.imdb.com/title/tt0071853/'
    },
    {
        title: 'Young Frankenstein',
        release_date: 1974,
        directors: ['Mel Brooks'],
        writers: ['Gene Wilder', 'Mel Brooks', 'Mary Shelley'],
        stars: ['Gene Wilder', 'Madeline Kahn', 'Marty Feldman'],
        imdb_link: 'https://www.imdb.com/title/tt0072431/'
    },
    {
        title: 'Blazing Saddles',
        release_date: 1974,
        directors: ['Mel Brooks'],
        writers: ['Mel Brooks', 'Norman Steinberg', 'Andrew Bergman'],
        stars: ['Cleavon Little', 'Gene Wilder', 'Slim Pickens'],
        imdb_link: 'https://www.imdb.com/title/tt0071230/'
    },
    {
        title: 'The Princess Bride',
        release_date: 1987,
        directors: ['Rob Reiner'],
        writers: ['William Goldman'],
        stars: ['Cary Elwes', 'Mandy Patinkin', 'Robin Wright'],
        imdb_link: 'https://www.imdb.com/title/tt0093779/'
    },
    {
        title: 'Spies Like Us',
        release_date: 1985,
        directors: ['John Landis'],
        writers: ['Dan Aykroyd', 'Dave Thomas', 'Lowell Ganz'],
        stars: ['Chevy Chase', 'Dan Aykroyd', 'Mark Stewart'],
        imdb_link: 'https://www.imdb.com/title/tt0090056/'
    },
    {
        title: 'This Is the End',
        release_date: 2013,
        directors: ['Evan Goldberg', 'Seth Rogen'],
        writers: ['Seth Rogan', 'Evan Goldberg', 'Jason Stone'],
        stars: ['James Franco', 'Jonah Hill', 'Seth Rogan'],
        imdb_link: 'https://www.imdb.com/title/tt1245492/'
    },
    {
        title: 'Memento',
        release_date: 2000,
        directors: ['Christopher Nolan'],
        writers: ['Christopher Nolan', 'Jonathan Nolan'],
        stars: ['Guy Pearce', 'Carrie-Anne Moss', 'Joe Pantoliano'],
        imdb_link: 'https://www.imdb.com/title/tt0209144/'
    },
    {
        title: 'The Boondock Saints',
        release_date: 1999,
        directors: ['Troy Duffy'],
        writers: ['Troy Duffy'],
        stars: ['Willem Dafoe', 'Sean Patrick Flanery', 'Norman Reedus'],
        imdb_link: 'https://www.imdb.com/title/tt0144117/'
    },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        release_date: 1977,
        directors: ['George Lucas'],
        writers: ['George Lucas'],
        stars: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher'],
        imdb_link: 'https://www.imdb.com/title/tt0076759/'
    },
    {
        title: 'Garden State',
        release_date: 2004,
        directors: ['Zach Braff'],
        writers: ['Zach Braff'],
        stars: ['Zach Braff', 'Peter Sarsgaard', 'Natalie Portman'],
        imdb_link: 'https://www.imdb.com/title/tt0333766/'
    },
    {
        title: 'Silver Linings Playbook',
        release_date: 2012,
        directors: ['David O. Russell'],
        writers: ['David O. Russell', 'Matthew Quick'],
        stars: ['Bradley Cooper', 'Jennifer Lawrence', 'Robert De Niro'],
        imdb_link: 'https://www.imdb.com/title/tt1045658/'
    },
    {
        title: 'Limitless',
        release_date: 2011,
        directors: ['Neil Burger'],
        writers: ['Leslie Dixon', 'Alan Glynn'],
        stars: ['Bradley Cooper', 'Anna Friel', 'Abbie Cornish'],
        imdb_link: 'https://www.imdb.com/title/tt1219289/'
    },
    {
        title: 'Inception',
        release_date: 2010,
        directors: ['Christopher Nolan'],
        writers: ['Christopher Nolan'],
        stars: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
        imdb_link: 'https://www.imdb.com/title/tt1375666/'
    },
    {
        title: 'The Terminal',
        release_date: 2004,
        directors: ['Steven Spielberg'],
        writers: ['Andrew Niccol', 'Sacha Gervasi', 'Jeff Nathanson'],
        stars: ['Tom Hanks', 'Catherine Zeta-Jones', 'Chi McBride'],
        imdb_link: 'https://www.imdb.com/title/tt0362227/'
    },
    {
        title: 'Catch Me If You Can',
        release_date: 2002,
        directors: ['Steven Spielberg'],
        writers: ['Frank Abagnale Jr.', 'Stan Redding', 'Jeff Nathanson'],
        stars: ['Leonardo DiCaprio', 'Tom Hanks', 'Christopher Walken'],
        imdb_link: 'https://www.imdb.com/title/tt0264464/'
    },
    {
        title: 'The Matrix',
        release_date: 1999,
        directors: ['Lana Wachowski', 'Lilly Wachowski'],
        writers: ['Lilly Wachowski', 'Lana Wachowski'],
        stars: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
        imdb_link: 'https://www.imdb.com/title/tt0133093/'
    }
];

app.get('/', (req, res) => {
    res.send('Welcome to My Movie App!')
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uhoh... something is broken');
});

app.listen(8080, () => {
    console.log('App is listening to port 8080')
});