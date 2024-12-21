const User = require('../../models/AuthServer/user.m')
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const info = await jwt.verify(req.cookies.checkLogin_Token, process.env.SECRET_AUTHSERVER_JWT)
        console.log("info in checktoken",info)
        const user = await User.FindById(info.id);
        req.user = user;
        req.user.Remember =  info.Remember;
        next();
    } catch (error) { 
        req.user = null;
        next();
    };
}