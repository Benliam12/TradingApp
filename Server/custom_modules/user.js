var passHash = require('password-hash')
let db = require('./db')

class User {

    constructor(name, pass) {
        this.name = name
        this.pass = pass

        this.verify()
    }

    isUser(){
        return this.exists
    }

    verify() {
        return true
    }

}

module.exports = User