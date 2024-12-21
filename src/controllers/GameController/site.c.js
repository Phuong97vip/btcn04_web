const User = require('../../models/GameServer/user.m')

module.exports = {
    GetGamePage: async (req,res,next) => {
        try {
            res.render('GameView/gameMainPage',{user: req.user,js: "gameMainPage.js", css: "gameMainPage.css",home: true});
        } catch (error) {
            next(error);
        };
    },
    GetMatchPage: async (req,res,next) => {
        try {
            if(req.query.id) {
                res.render('GameView/gameCreateMatch',{user: req.user, match: true,matchID: req.query.id});
            } else {
                res.render('GameView/gameCreateMatch',{user: req.user, match: true});
            }
        } catch (error) {
            next(error);
        };
    },
    GetRankPage: async (req,res,next) => {
        try {
            let userList = await User.GetAllUser();
            userList = userList.sort((a,b) => b.score - a.score);
            res.render('GameView/gameRank',{user: req.user, rank: true,userList: userList});
        } catch (error) {
            next(error);
        };
    },
    GetProfilePage: async (req,res,next) => {
        try {
            res.render('GameView/gameProfile',{user: req.user, profile: true,js: "gameProfile.js"});
        } catch (error) {
            next(error);
        };
    },
}