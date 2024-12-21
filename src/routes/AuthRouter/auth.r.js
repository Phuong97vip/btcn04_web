const express = require('express');
const path = require('path');
const AuthController = require('../../controllers/AuthController/auth.c');
const CheckAuthConfig = require('../../middlewares/AuthMiddleware/CheckAuthConfig');
const checkChangeToken = require('../../middlewares/AuthMiddleware/checkChangeToken');
const CreateJwt = require('../../middlewares/AuthMiddleware/CreateJwt');
const router = express.Router();


router.get('/LoginSignUp', AuthController.GetLoginSignupPage);
router.post('/login',AuthController.LogIn);
router.post('/signup', AuthController.SignupNewUser);
router.post('/logout', AuthController.logout);
router.get('/oauth2/auth', CheckAuthConfig,checkChangeToken, AuthController.getOauth2Page);
router.post('/oauth2/login', AuthController.AuthPageLogin);
router.post('/oauth2/accept',checkChangeToken, CreateJwt)


module.exports = router;