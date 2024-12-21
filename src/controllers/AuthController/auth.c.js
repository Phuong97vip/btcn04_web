const User = require('../../models/AuthServer/user.m');
const saltRounds = 10;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateId = async () => {
    let start = 100000000
    let end = 999999999;
    let id;
    while (true) {
        id = Math.floor(Math.random() * (end - start + 1)) + start;
        if (await User.FindById(id) == null) break;
    }

    return id;
}

module.exports = {
    GetLoginSignupPage: async (req, res, next) => {
        try {
            res.render('authView/authLoginSignup', { css: 'authLoginSignup.css', js: 'authLoginSignup.js', mss: req.query.err });
        } catch (error) {
            next(error);
        };
    },
    LogIn: async (req, res, next) => {
        console.log("Received password:", req.body.password);
        console.log("Type of req.body.password:", typeof req.body.password);
        const rs = await User.FindByUsername(req.body.username);
        console.log("rs auth.c.js: ",rs);
        let auth = false;
        if (rs != undefined) {
            auth = await bcrypt.compare(req.body.password, rs.password);
            console.log("auth: ",auth);
            console.log("req.body.password: ",req.body.password);
            console.log("Password stored in database:", rs.password);

        }
        if (auth) {
            const info = {
                id: rs.id
            }
            let token = await jwt.sign(info, process.env.SECRET_AUTHSERVER_JWT);

            if(req.body.Remember == 'true') {
                res.cookie('authServer_jwt', token,{maxAge: 7200000 });
            } else {
                res.cookie('authServer_jwt', token);
            }
            res.redirect(`https://localhost:53003/mainpage`);
        } else {
            res.redirect(`https://localhost:53003/loginSignup?err="Wrong username or password!`);
        }
    },
    SignupNewUser: async (req, res) => {
        try {
            let signUpData = req.body;
            let id = await generateId();
            signUpData.id = id;
            console.log("password before hash: ",signUpData.password);
            // Đảm bảo mật khẩu được băm đúng cách
            signUpData.password = await bcrypt.hash(signUpData.password, saltRounds);
            console.log("Password after hashing1:", signUpData.password);
            console.log("signUpData: ",signUpData);
            await User.AddUser(signUpData);
            res.json({ "mss": "success" });
        } catch (error) { 
            res.json({ "mss": error.message });
        }
    },
    OauthSignupNewUser: async (req, res) => {
        try {
            let signUpData = req.body;
            let id = await generateId();
            signUpData.id = id;
            await bcrypt.hash(signUpData.password, saltRounds).then(function (hash) {
                signUpData.password = hash;
            });
            await User.AddUser(signUpData);
            res.redirect('/cc')
        } catch (error) {
            res.redirect('/cc')
        };
    },
    logout: async (req, res) => {
        try {
            res.cookie('authServer_jwt','')
            res.redirect('/loginSignup');
        } catch (error) {
            next(error);
        };
    },
    getOauth2Page: async (req, res, next) => {
        if (req.Error) {
            return res.render('AuthView/authPage', { err: req.Error.message, authConfig: req.query });
        }
        if (req.query.err) {
            res.render('AuthView/authPage', { hasAuth: false, authConfig: req.session.oauth, loginError: req.query.err });
        } else {
            if (req.user) {
                res.render('AuthView/authPage', { hasAuth: true, authConfig: req.session.oauth, user: req.user });
            } else {
                res.render('AuthView/authPage', { hasAuth: false, authConfig: req.session.oauth });
            }
        }
    },
    AuthPageLogin: async (req, res, next) => {
        try {
            const rs = await User.FindByUsername(req.body.username);
            const oauth = req.session.oauth;
            const queries = new URLSearchParams(oauth);
            let auth = false;
    
            console.log("Received username:", req.body.username);
            console.log("Received password:", req.body.password);
            console.log("Password length:", req.body.password.length);
    
            if (rs != undefined) {
                console.log("Stored hashed password:", rs.password);
                auth = await bcrypt.compare(req.body.password, rs.password);
                console.log("Authentication result:", auth);
            } else {
                console.log("User not found.");
            }
    
            let Remember = req.body.Remember ? true : false;
            if (auth) {
                const info = {
                    id: rs.id,
                    username: rs.username,
                    nickname: rs.nickname,
                    fullname: rs.fullname,
                    Remember: Remember
                }
                const token = await jwt.sign(info, process.env.SECRET_AUTHSERVER_JWT);
                res.cookie('checkLogin_Token', token);
                return res.redirect(`https://localhost:53003/oauth2/auth?${queries}`);
            } else {
                return res.redirect(`https://localhost:53003/oauth2/auth?err=wrong username or password&${queries}`);
            }
        } catch (error) {
            console.error("Error in AuthPageLogin:", error);
            next(error);
        }
    },
}
