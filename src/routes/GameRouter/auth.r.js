const express = require('express');
const authController = require('../../controllers/GameController/auth.c');
const ResInReq = require('../../middlewares/GameMiddleware/ResInReq');
const router = express.Router();

router.get('/login', authController.GetPage);
router.post('/logout',authController.logout);

module.exports = router;