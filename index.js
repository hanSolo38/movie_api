const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//const swaggerUI = require('swagger-ui-express');

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true}));

//const swaggerFile = path.join(__dirname, 'apiSwagger.json');
//const swaggerJson = JSON.parse(fs.readFileSync(swaggerFile, 'utf8'));

// NOTE: removed useNewUrlParser and useUnifiedTopology as they are depricated and are set by default
//mongoose.connect('mongodb://localhost:27017/movieDB');
mongoose.connect(process.env.CONNECTION_URI);

// * for creating a log which uses FS
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));

// NOTE: this is shorthand for app.use('/', express.static('public'));
app.use(express.static('public'));

//* CORS Cross-Origin Resource Sharing (add before any route middleware)
const cors = require('cors');
/* Allows requests from all origins 
app.use(cors()); 
*/
app.use(cors());
//* Code only allows requests from domains listed below
// let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

// app.use(cors({
//     origin: (origin, callback) => {
//         if(!origin) return callback(null, true);
//         if(allowedOrigins.indexOf(Origin) === -1){
//             let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
//             return callback(new Error(message ), false);
//         }
//         return callback(null, true);
//     }
// }));

const movieRoutes = require('./routes/movieRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

// NOTE: swagger endpoint
//app.use('/api_docs', swaggerUI.serve, swaggerUI.setup(swaggerJson));

//! API CALLS BELOW

// * READ HomePage
app.get('/', async (req, res) => {
    res.send('Welcome to My Movie App!')
});

app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

//* error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Uhoh... something is broken');
});

//* Location of API 
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});

//DEPRECATED:
// app.listen(8080, () => {
//     console.log('App is listening to port 8080')
// });