const User = require('../../models/GameServer/user.m')

module.exports = {
    UpdateUser: async (req,res,next) => {
        const newUser = req.body;
        if (req.file) newUser.image = `game/${newUser.id}.jpg`
        await User.UpdateUser(parseInt(newUser.id),newUser);
        res.redirect('/gamepage');
    },
}