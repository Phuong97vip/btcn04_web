const express = require('express');
const siteController = require('../../controllers/AuthController/site.c');
const router = express.Router();
require('dotenv').config();
const checkAuthJwt = require('../../middlewares/AuthMiddleware/CheckAuthJWT');


router.use('*',checkAuthJwt,async (req, res, next) => {
    if(req.user) return next();
    // update middleware to check if user is logged in
    return res.redirect('/loginSignup');
})
router.get('/mainpage', siteController.GetMainPage);

module.exports = router;