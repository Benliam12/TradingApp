function reconnect() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    return new WebSocket("ws://localhost:8080");
}

$(function() {

    var isconnected = false;

    $("#connect-btn").click(function() {
        if (!isconnected) {
            connection = reconnect();

            connection.onopen = function() {
                isconnected = true;
            }

            connection.onmessage = function(message) {
                $("#amount").text(message.data);
            }

            connection.onclose = function() {
                $("#amount").text("Connexion closed!");
                $("#connect-btn").text("Reconnect")
                isconnected = false;
            }
        }
    });





})