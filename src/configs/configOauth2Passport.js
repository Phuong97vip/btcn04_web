const passport = require('passport');
const MyOauth2SPP = require('../ultis/CustomStrategy/customO2SPP');
const User = require('../models/GameServer/user.m');
const jwt = require('jsonwebtoken');
require('dotenv').config();

passport.serializeUser((token, done) => {
    done(null, token);
});
passport.deserializeUser(async (token, done) => {
    try {
        if (token == undefined) return done('Missing jwt');
        const user = await jwt.verify(token, process.env.SECRET_KEY_JWT);
        done(null, user);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            done(null, false);
        } else {
            done('Verify token err');
        }
    };
});

const configPassport = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new MyOauth2SPP({
        authorizationURL: "https://localhost:53003/oauth2/auth",
        clientID: "21120534",
        clientSecret: "21120534",
        callbackURL: "https://localhost:21534/login/callback",
    }, async (token, done) => {
        try {
            if (token == undefined) return done('Missing jwt');
            const user = await jwt.verify(token, process.env.SECRET_KEY_JWT);
            const findUser = await User.FindById(user.id);
            if(!findUser) {
                User.AddUser(user);
            }
            done(null, token);
        } catch (error) {
            done('Verify token err');
        };

    }, {}))
}
module.exports = configPassport;