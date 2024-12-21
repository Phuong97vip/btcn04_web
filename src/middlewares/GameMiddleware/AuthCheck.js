const jwt = require("jsonwebtoken");
const User = require('../../models/GameServer/user.m');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const data = await jwt.verify(token,process.env.SECRET_KEY_JWT);
        const user = await User.FindById(data.id);
        req.user = user;
        next();
    } catch (error) {
        return res.redirect(`/login`)
    };
}