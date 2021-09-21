module.exports = class Beter{
    constructor(id,username,avatar,amount){
        this.id = id;
        this.username = username;
        this.avatar = avatar;
        this.amount = amount;
    }

    getMoney(){
        return this.amount;
    }

    getId(){
        return this.id;
    }

    removeMoney(money){
        this.amount -= money;
    }

    getUsername(){
        return this.username;
    }

    addMoney(money){
        this.amount+=money;
    }
}