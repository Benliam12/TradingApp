function reconnect() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    window.connection = new WebSocket("ws://localhost:8080");

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

    var number = Math.round(Math.random() * 0xFFFFFF);
    $("#username").val(number);

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
            var amount = $("#user_amount").val();
            if (amount > 0) {
                var value = $("#username").val().toString();
                window.connection.send(value + "," + amount.toString() + ",buy");
            }
        }
    });

    $("#sell-btn").click(function() {
        if (window.isconnected) {
            var amount = $("#user_amount").val();
            if (amount > 0) {
                var value = $("#username").val().toString();
                window.connection.send(value + "," + amount.toString() + ",sell");
            }
        }
    });





})