const fs = require('fs');
const https = require('https');
const path = require('path');

const ConfigHttps =  (app,dir) =>{
    const server = https.createServer({
        key: fs.readFileSync(path.join(dir,'/app.key')),
        cert: fs.readFileSync(path.join(dir,'/app.cert'))
    },app)
    return server;
}

module.exports = ConfigHttps;
