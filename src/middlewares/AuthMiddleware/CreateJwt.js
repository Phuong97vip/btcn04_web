require('dotenv').config();
const env = process.env;
const User = require('../../models/AuthServer/user.m');
const jwt = require('jsonwebtoken');


module.exports = async (req, res, next) => {
    const user = req.user;
    if (!user) next(new Error("err"));
    const configAuth = req.session.oauth;
    console.log("configAuth in create jwt: ", configAuth);
    let info;
    if (req.body.shareAvatar == 'true') {
        info = {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            fullname: user.fullname,
            shareAvatar: true,
            image: user.image
        }
    } else {
        info = {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            fullname: user.fullname,
            shareAvatar: false,
        }
    }

    const accessToken = await jwt.sign(JSON.stringify(info), env.SECRET_KEY_JWT);
    if (req.user.Remember == true) {
        res.cookie('jwt', accessToken, { maxAge: 7200000 });

    } else {
        res.cookie('jwt', accessToken);

    }
    res.cookie('checkLogin_Token', '');
    return res.redirect(configAuth.callbackURL);
}