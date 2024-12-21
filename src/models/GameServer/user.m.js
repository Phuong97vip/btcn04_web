const DbProvider = require('../../ultis/DataBaseProvider/GameDbProvider')

module.exports = class User {
    constructor(obj) {
        this.id = obj.id;
        this.username = obj.username;
        this.nickname = obj.nickname;
        this.fullname = obj.fullname;
        this.image = obj.image;
        this.score = obj.score;
    }
    static async GetAllUsername() {
        const listUsername = await DbProvider.GetAllUsername();
        return listUsername;
    }
    static async GetAllUser() {
        const listUsername = await DbProvider.GetAllUser();
        return listUsername;
    }
    static async FindByUsername(username) {
        const user = await DbProvider.FindUserByUsername(username);
        if(user == null) return null;
        return new User(user);
    }
    static async FindById(id) {
        const user = await DbProvider.FindUserById(id);
        if(user == null) return null;
        return new User(user);
    }
    static async UpdateUser(id,user) {
        const check = await DbProvider.UpdateUser(id,user);
        return check;
    }
    static async UpdateScore(id,bonus) {
        await DbProvider.UpdateScore(id,bonus);
    }
    static async AddUser(user) {
        if(! user.shareAvatar) {
            user.image = 'game/default.jpg'
        }
        user.score = 0;
        await DbProvider.AddUser(user);
    }
}