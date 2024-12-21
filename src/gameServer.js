require('dotenv').config();
const express = require('express');
const env = process.env;
const configStaticResource = require('./configs/configStaticResource');
const configViewEngine = require('./configs/configViewEngine');
const configHttps = require('./configs/ConfigHttps');
const configSession = require('./configs/configSession');
const configPassport = require('./configs/configOauth2Passport');
const cookieParser = require('cookie-parser');
const User = require('./models/GameServer/user.m')
const path = require('path');
const port = env.GAME_SERVER_PORT ||21534;
const app = express();



// config
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
configStaticResource(app, path.join(__dirname, 'public'));
configSession(app);
configPassport(app);
configViewEngine(app, path.join(__dirname, 'views'));



// routes
app.use('/api', require('./routes/GameRouter/api.r'));
app.use(require('./routes/GameRouter/auth.r'));
app.use(require('./routes/GameRouter/site.r'));


// Https
const server = configHttps(app, path.join(__dirname, 'certs'));





server.listen(port, () => {
    console.log(`GameServer is listening on port ${port} - ${env.HOST}`)
})

