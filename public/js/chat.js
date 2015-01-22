var socket = io.connect('http://localhost:8080');
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

$( document ).ready(function() {
    $('.sendImage').fancybox({
		minWidth	: 520,
		minHeight	: 25,
		width	: 520,
		height	: 25,
		fitToView	: false,
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none'
	});
	
	$('#sendImg').click(function(){
	var imgWidth = parseInt($("#imgWidth").val()) > 0 ? $("#imgWidth").val() : "200px";
	var imgHeight = parseInt($("#imgHeight").val()) > 0 ? $("#imgHeight").val() : "300px";
		socket.emit("message", "<img src=" + $("#valueImg").val() + " width="+ imgWidth +" height=" + imgHeight +"/>");
	});
});