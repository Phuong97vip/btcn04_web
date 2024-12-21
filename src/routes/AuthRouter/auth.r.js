const express = require('express');
const path = require('path');
const AuthController = require('../../controllers/AuthController/auth.c');
const router = express.Router();


router.get('/LoginSignUp', AuthController.GetLoginSignupPage);
router.post('/login',AuthController.LogIn);
router.post('/signup', AuthController.SignupNewUser);
router.post('/logout', AuthController.logout);


module.exports = router;