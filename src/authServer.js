require('dotenv').config();
const env = process.env;
const express = require('express');
const configStaticResource = require('./configs/configStaticResource');
const configViewEngine = require('./configs/configViewEngine');
const configHttps = require('./configs/ConfigHttps');
const configSession = require('./configs/configSession');
const cookieParser = require('cookie-parser');
const path = require('path');
const port = env.AUTH_SERVER_PORT || 53003; // Fallback to 53003 if not defined
const app = express();

//Config
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())
configSession(app);
configStaticResource(app, path.join(__dirname, 'public'));
configViewEngine(app, path.join(__dirname, 'views'));

// routes
app.use('/api', require('./routes/AuthRouter/api.r'));
app.use(require('./routes/AuthRouter/auth.r'));
app.use(require('./routes/AuthRouter/site.r'));

// Https
const server = configHttps(app, path.join(__dirname, 'certs'));
server.listen(port, () => {
    console.log(`AuthServer is listening on port ${port} - ${env.HOST}`)
})

