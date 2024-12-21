const express = require('express');
const AuthCheck = require('../../middlewares/GameMiddleware/AuthCheck');
const SiteController = require('../../controllers/GameController/site.c');
const router = express.Router();


router.use('*',AuthCheck);



module.exports = router;