module.exports = {
    GetPage: async (req,res,next) => {
        try {
            res.render(`GameView/gameLogin`,{css: 'gameLoginSignUp.css'});
        } catch (error) {
            next(error);
        };
    },
    logout: async (req,res,next) => {
        try {
            res.cookie('jwt','');
            res.redirect('/login')
        } catch (error) {
            next(error);
        };
    }
}