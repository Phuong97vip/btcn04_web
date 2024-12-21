const User = require('../../models/AuthServer/user.m')
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const info = await jwt.verify(req.cookies.authServer_jwt, process.env.SECRET_AUTHSERVER_JWT)
        const user = await User.FindById(info.id);
        req.user = user;
        next();
    } catch (error) { 
        req.user = null;
        next();
    };
}