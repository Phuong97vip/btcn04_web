const express = require('express');
const AuthCheck = require('../../middlewares/GameMiddleware/AuthCheck');
const SiteController = require('../../controllers/GameController/site.c');
const router = express.Router();


router.use('*',AuthCheck);
router.get('/gamepage',SiteController.GetGamePage);
router.get('/match',SiteController.GetMatchPage);
router.get('/profile',SiteController.GetProfilePage);
router.get('/rank',SiteController.GetRankPage);



module.exports = router;