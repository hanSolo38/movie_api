const jwtSecret = 'your_jwt_secret'; //NOTE: Has to be same key used in JWTStrategy in passport.js
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport.js'); //NOTE: Location of strategies in passport.js

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //NOTE: This is the username being encoded in JWT
        expiresIn: '7d', 
        algorithm: 'HS256' //NOTE: algorithm used to "sign" or encode the values of the JWT
    });
}

//* POST login
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local', { session: false }, (error, user, info) => {
            if (error || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, { session: false }, (error) => {
                if (error) {
                    res.send(error);
                }
                let token = generateJWTToken(user.toJSON());
                return res.json({ user, token });  //NOTE: ES6 shorthand for res.json({ user: user, token: token }). if keys are same as values, you can use shorthand
            });
        })(req, res);
    });
}