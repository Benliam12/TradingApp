var express = require('express');
var http = require("http");
var app = express();
var path = require('path');
var sqlite3 = require("sqlite3").verbose();
var WebSocketServer = require("websocket").server;

let db = new sqlite3.Database("db.db", (err) => {
    if (err) {
        return console.error(err.message);
    }

    console.log("Connected to in memory db");
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
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

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(200, {
        "Content-Type": "text/html"
    });

    response.write("Yello!")

    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

wsServer.on("request", (request) => {

    var connection = request.accept(null, request.origin)

    console.log("New connexion from " + request.origin + " (" + connection.remoteAddress + ")");

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var response = message.utf8Data.split(",")
            wsServer.broadcast(response[1]);
            // connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });


    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });

})

function broadcast() {
    var number = Math.round(Math.random() * 0xFFFFFF);

    wsServer.broadcastUTF(number);
    setTimeout(broadcast, 200);
}

broadcast();