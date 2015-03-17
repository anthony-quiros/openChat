var socket = io.connect(window.location.host);

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

socket.on('message', getMessage);
socket.on('messageACK', getMessageACK);
socket.on('image', getImage);
socket.on("alias", showAliasForm);
socket.on("download", getFile);
socket.on("aliasACK", getAliasACK);
socket.on("join", createMemberElement);
socket.on("left", removeMemberElement);
socket.on("code", getCode);
socket.on("codeACK", getCodeACK);
socket.emit("historic");