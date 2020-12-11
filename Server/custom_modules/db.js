var sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("db.db", (err) => {
    if (err) {
        return console.error(err.message);
    }

    console.log("Connected to in memory db");
});


db.serialize(() => {
    db.each(
        `CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username varchar(255),
            password varchar(255),
            tokens int(11)
        );`
    );

    db.each(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id int(11),
            amount int(11),
            created DATE
        )
    `)

    /*db.each(`
            INSERT INTO accounts(username,password,tokens) VALUES(?,?,?)
    `, ['Benliam12', "haha", 0]);*/

    db.each(`
        UPDATE accounts SET tokens = ? WHERE id = ?
    `, [25120, 1], (err) => {})

    db.each(
        `SELECT * FROM accounts`, (err, row) => {
            if (!err) {
                console.log("ACCOUNT: " + row.username + " tokens:" + row.tokens + "(" + row.id + ")")
            }
        })

    db.each(`
        UPDATE accounts SET tokens = ? WHERE id = ?
    `, [250, 1], (err) => {})
});

db.close((err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log("Closed database with success")
})





module.export = db