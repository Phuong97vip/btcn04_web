const DbProvider = require('../../ultis/DataBaseProvider/AuthDbProvider')

module.exports = class OauthConfig {
    constructor(obj) {
        this.clientID = obj.clientID;
        this.clientSecret = obj.clientSecret;
        this.callbackURL = obj.callbackURL
    }
    static async Get()  {
        const rs = await DbProvider.GetAuthConfig();
        return rs;
    }
    static async Update(config)  {
        const rs = await DbProvider.UpdateOauthConfig(config);
        return rs;
    }
}