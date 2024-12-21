const session = require('express-session')
require('dotenv').config();

const configSession = (app) => {
    app.use(session(
        {
            secret: process.env.SECRET_KEY,
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true }
    }))
}

module.exports = configSession;