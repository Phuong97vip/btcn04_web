const DbProvider = require('../../ultis/DataBaseProvider/AuthDbProvider')

module.exports = class User {
    constructor(obj) {
        this.id = obj.id;
        this.username = obj.username;
        this.password = obj.password;
        this.nickname = obj.nickname;
        this.fullname = obj.fullname;
        this.image = obj.image;
    }
    static async GetAllUsername() {
        const listUsername = await DbProvider.GetAllUsername();
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
    static async AddUser(user) {
        await DbProvider.AddUser(user);
    }
}