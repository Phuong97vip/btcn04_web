const { engine } = require('express-handlebars');

const configViewEngine = (app,path) => {
    app.engine('hbs', engine({extname: ".hbs"}));
    app.set('view engine', 'hbs');
    app.set('views', path);
}

module.exports = configViewEngine;