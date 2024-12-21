const express = require('express');
const authController = require('../../controllers/GameController/auth.c');
const ResInReq = require('../../middlewares/GameMiddleware/ResInReq');
const router = express.Router();
const passport = require('passport');


router.get('/login', authController.GetPage);
router.post('/logout',authController.logout);
router.post('/login', ResInReq,passport.authenticate('MyOauth2'));
router.get('/login/callback', passport.authenticate('MyOauth2',{ successRedirect: '/gamepage',failureRedirect: `/login`}));

module.exports = router;