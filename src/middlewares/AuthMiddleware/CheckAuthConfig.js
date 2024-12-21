const DbProvider = require('../../ultis/DataBaseProvider/AuthDbProvider')
module.exports = async (req, res, next) => {
    const authConfig = await DbProvider.GetAuthConfig();
    if(!req.session.oauth) {
        req.session.oauth = req.query;
    }
    if (authConfig.clientID != req.session.oauth.clientID || authConfig.clientSecret != req.session.oauth.clientSecret) {
        req.Error = new Error('Invalid client ID or client secret');
    } else if (!authConfig.callbackURL.includes(req.session.oauth.callbackURL)) {
        req.Error = new Error('Invalid callback URL');
    }
    return next();
}