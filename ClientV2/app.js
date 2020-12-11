function reconnect() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    window.number = Math.round(Math.random() * 0xFFFFFF);

    window.connection = new WebSocket("ws://localhost:8080?user=" + number.toString());

    connection.onopen = function() {
        window.isconnected = true;
        console.log("Connected!");

        $("#connect-btn").text("Disconnect");
        $("#connect-btn").removeClass("btn-success");
        $("#connect-btn").addClass("btn-danger");
    }

    connection.onmessage = function(message) {
        $("#amount").text(message.data);
    }

    connection.onerror = function(message) {
        console.log(message)
    }

    connection.onclose = function() {
        $("#amount").text("Connexion ended!");
        $("#connect-btn").text("Reconnect")
        $("#connect-btn").removeClass("btn-danger");
        $("#connect-btn").addClass("btn-success");
        window.isconnected = false;
    }
}

$(function() {
    window.connection = null;
    console.log("GOOD");

    window.isconnected = false;

    reconnect();

    $("#connect-btn").click(function() {
        if (!window.isconnected) {
            reconnect();
        } else {
            if (window.connection != null) {
                window.connection.close();
            }
        }
    });

    $("#buy-btn").click(function() {
        if (window.isconnected) {
            var amount = parseInt($("#user_amount").val());
            if (amount > 0) {
                window.connection.send(number + "," + amount.toString() + ",buy");
            }
        }
    });

    $("#sell-btn").click(function() {
        if (window.isconnected) {
            var amount = parseInt($("#user_amount").val());
            if (amount > 0) {
                window.connection.send(number + "," + amount.toString() + ",sell");
            }
        }
    });





})