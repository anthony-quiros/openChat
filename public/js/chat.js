var socket = io.connect('http://aquiros.fr.cr');
var getMessage = function(message) {
	var list = document.getElementById("listOfMessages");
	list.innerHTML = list.innerHTML + "<br/>" + message;
};
var sendMessage = function () {
	var message = document.getElementById("message").value;
	console.log(message);
	socket.emit("message", message);
	var list = document.getElementById("listOfMessages");
	list.innerHTML = list.innerHTML + "<br/>" + message;
}

var sendAlias = function (message) {
	var alias = prompt(message);
	socket.emit("alias", alias);
}
socket.on('message',getMessage);
/*socket.on("alias", sendAlias);*/
document.getElementById("sendMessage").addEventListener("click", sendMessage);