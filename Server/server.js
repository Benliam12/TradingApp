var express = require('express');
var http = require("http");
var app = express();
var path = require('path');
var bodyParser = require("body-parser")
var WebSocketServer = require("websocket").server;
var passwordHash = require("password-hash")
var User = require("./custom_modules/user")
var readline = require("readline")
var sqlite3 = require("sqlite3").verbose();
var database = require('./custom_modules/db');



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));
});


app.post("/trade", function(req, res) {
    if (req.body.user != undefined) {
        console.log(req.body.user);

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        res.send("YOLO")
    }
});

var server = http.createServer(app);

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

users = {}

wsServer.on("request", (request) => {
    var user = request.resourceURL.query.user

    if (user == undefined) {
        console.log("Connexion from " + request.origin + " was rejected because no user was specified");
        request.reject();
        return;
    }

    var connection = null;

    if (user in users) {
        users[user].send("You log in somewhere else!");
        users[user].close();
        users[user] = request.accept(null, request.origin);
    } else {
        users[user] = request.accept(null, request.origin)
    }
    var connection = users[user];
    console.log("New connexion from " + request.origin + " (" + user + ")");

    connection.on('message', function(message) {

        return;

        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            var response = message.utf8Data.split(",")
            wsServer.broadcast(response[1]);

            if (response[1] in users) {
                users[response[1]].close()
            }
            // connection.sendUTF(message.utf8Data);
        } else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });

    connection.on('close', function(reasonCode, description) {
        users[user] = undefined;
        console.log((new Date()) + ' Peer ' + user + ' disconnected.');
    });
})

function broadcast() {
    var number = Math.round(Math.random() * 0xFFFFFF);

    wsServer.broadcastUTF(number);
    setTimeout(broadcast, 200);
}

broadcast();

var test_pass = passwordHash.generate("TOTO")
var verif = passwordHash.verify("TOTO", "sha1$ef1e1493$1$1bda181b9d79c81414e378841af76e875be74aee")
console.log(test_pass)

console.log(verif)


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

process.on('SIGINT', () => {
    database.close((err) => {
        if (err) {
            return console.error(err.message)
        }
        console.log("Closed database with success")
    })
});