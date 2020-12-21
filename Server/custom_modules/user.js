class User {

    constructor(name, pass) {
        this.name = name
        this.pass = pass
    }

    verify() {
        return true
    }

}

module.exports = User