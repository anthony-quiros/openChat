var socket = io.connect(window.location.host);

//variables de configuration client
var notificationVolume;
var notificationSample;


//Initialisation des variables de configuration client
$.getJSON('clientConfiguration.json', function(data) {
	notificationVolume = data.notificationVolume;
	notificationSample = data.notificationSample;
});

function createBrElement() {
	return document.createElement("br");
}

function createMessageElement(alias, message, date) {
	var list = document.getElementById("listOfMessages");
	var messageClass = (null == alias) ? 'fromMe' : 'notFromMe';
	var myAlias = (null == alias) ? 'You' : alias;
	var messageElement = document.createElement("div");
	var aliasElement = document.createElement("div");
	var contentElement = document.createElement("div");
	var aliasSpan = document.createElement("span");
	messageElement.setAttribute("class", messageClass);
	messageElement.setAttribute("title", date);
	aliasElement.setAttribute("class", "alias");
	aliasSpan.innerHTML = myAlias;
	aliasElement.appendChild(aliasSpan);
	contentElement.setAttribute("class", "content");
	contentElement.innerHTML = message; 
	messageElement.appendChild(aliasElement);
	messageElement.appendChild(contentElement);
	list.appendChild(messageElement);
	list.appendChild(createBrElement());
	return messageElement;
};

function sendAlias() {
	var alias = $('#txtAlias').val();
	if('' != alias) {
		socket.emit('alias', alias);
	}
}

function getAliasACK(response) {
	if(response.result) {
		cookiesManager.createCookie("alias", response.alias, 10);
		privateAlias = response.alias;
		$('.fancybox-close').click();
	} else {
		alert(response.message);
	}
}

function sendMessage() {
	var message = $("#message").html();
	var messageToAppend = isEncHTML(message) ? decHTMLifEnc(message) : message;
	socket.emit("message", messageToAppend);
}

function getMessageACK(result) {
	if(result.result) {
		console.log(result);
		var messageToAppend = isEncHTML(result.message.message) ? decHTMLifEnc(result.message.message) : result.message.message;
		createMessageElement(null, messageToAppend, result.message.date);
		$("#message").html("");
		$('#listOfMessages').scrollTop($('#listOfMessages')[0].scrollHeight);
	}
}

var getMessage = function(result) {
	var messageToAppend = isEncHTML(result.message.message) ? decHTMLifEnc(result.message.message) : result.message.message;
	createMessageElement(result.message.alias, messageToAppend, result.message.date);
	$('#listOfMessages').scrollTop($('#listOfMessages')[0].scrollHeight);
	if(!result.historique){
		var sound = new Howl({
			urls: ['sounds/' + notificationSample],
			volume: notificationVolume
		}).play();
	}
};

document.getElementById("sendMessage").addEventListener("click", sendMessage);