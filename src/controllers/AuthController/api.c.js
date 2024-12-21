const User = require('../../models/AuthServer/user.m')
const OauthConfig = require('../../models/AuthServer/oauthConfig.m');

module.exports = {
    GetAllUsername: async (req,res,next) => {
        const data = await User.GetAllUsername();
        res.json(data);
    },
    UpdateUser: async (req,res,next) => {
        const newUser = req.body;
        if (req.file) newUser.image = `${newUser.id}.jpg`
        const data = await User.UpdateUser(parseInt(newUser.id),newUser);
        res.redirect('/mainPage');
    },
    UpdateOauthConfig: async (req,res,next) => {
        const config = req.body;
        const data = await OauthConfig.Update(config);
        res.json(data);
    }
}