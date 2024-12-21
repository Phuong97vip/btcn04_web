const OauthConfig = require('../../models/AuthServer/oauthConfig.m')

module.exports = {
    GetMainPage: async (req,res,next) => {
        try {
            const authInfo = await OauthConfig.Get();
            res.render('AuthView/authMainPage',{user: req.user,authInfo: authInfo, js: "authMainPage.js"});
        } catch (error) {
            next(error);
        };
        
    }
}