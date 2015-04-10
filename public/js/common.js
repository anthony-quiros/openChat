var socket = io.connect(window.location.host);
var xmlnsSvg = "http://www.w3.org/2000/svg";
//variables de configuration client
var notificationVolume;
var notificationSample;
var notificationActivated;


//Initialisation des variables de configuration client
$.getJSON('clientConfiguration.json', function(data) {
	notificationVolume = data.notificationVolume;
	notificationSample = data.notificationSample;
	notificationActivated = data.notificationActivated;
});

function createBrElement() {
	return document.createElement("br");
}

function createPolygonElement(points, style) {
	var lineElement = document.createElementNS(xmlnsSvg, "polygon");
	lineElement.setAttribute("points", points);
	lineElement.setAttribute("style", style);
	return lineElement;
}
function createMessageElement(alias, message, date, isDownload) {
	var list = document.getElementById("listOfMessages");
	var messageClass = (null == alias) ? 'fromMe' : 'notFromMe';
	var myAlias = (null == alias) ? 'You' : alias;
	var messageElement = document.createElement("div");
	var aliasElement = document.createElement("div");
	var contentElement = document.createElement("div");
	var aliasSpan = document.createElement("span");
	var svgElement = document.createElementNS(xmlnsSvg,"svg");
	svgElement.setAttribute("class", "bubble");
	svgElement.setAttribute("width", "20px");
	svgElement.setAttribute("height", "20px");
	messageElement.setAttribute("class", messageClass);
	messageElement.setAttribute("title", date);
	if(null == alias) {
		svgElement.appendChild(createPolygonElement("0,20 20,20 20,0", "fill:#3CF;"));
	} else {
		svgElement.appendChild(createPolygonElement("0,0 0,20 20,20", "fill:#3CF;"));
	}
	messageElement.appendChild(svgElement);	
	aliasElement.setAttribute("class", "alias");
	aliasSpan.innerHTML = myAlias;
	aliasElement.appendChild(aliasSpan);
	contentElement.setAttribute("class", "content");
	if(isDownload) {
		contentElement.appendChild(createDownloadImage());
		contentElement.appendChild(message);
	} else {
		contentElement.innerHTML = message;
		contentElement.addEventListener("click",function (){
		detectAndCopyLink(this);
	});
	}
	messageElement.appendChild(aliasElement);
	messageElement.appendChild(contentElement);
	list.appendChild(messageElement);
	list.appendChild(createBrElement());
	return messageElement;
};

function createDownloadImage() {
	var svgElement = document.createElement("div")
	svgElement.setAttribute("class","download");
	svgElement.innerHTML="&nbsp;"
	return svgElement;
}
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
		closeAliasForm()
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

var getCode = function(result) {
	console.log(result);
	 hljs.highlightBlock(createMessageElement(result.alias, result.message, result.date));
};

var getCodeACK = function(message) {
	console.log(message);
	 hljs.highlightBlock(createMessageElement(null, message.message, message.date));
};

var getMessage = function(result) {
	var messageToAppend = isEncHTML(result.message) ? decHTMLifEnc(result.message) : result.message;
	createMessageElement(result.alias, messageToAppend, result.date);
	$('#listOfMessages').scrollTop($('#listOfMessages')[0].scrollHeight);
	if(!result.historique && notificationActivated){
		var sound = new Howl({
			urls: ['sounds/' + notificationSample],
			volume: notificationVolume
		}).play();
	}
};

function initDropZone(selector, hideAfter) {
	var after = hideAfter;
	Dropzone.autoDiscover = false;
	myDropzone = new Dropzone(selector);
	myDropzone.on("drop", 
		function(event) {
			myDropzone.removeAllFiles();
		}
	);
	myDropzone.on(Dropzone.SUCCESS, 
		function(file) {
			var uploadElement = file.previewElement;
			if(null != uploadElement) {
				if(after) {
					uploadElement.addEventListener("click", 
						function() {
							myDropzone.removeAllFiles();
						}
					);
				} else {
					setTimeout(
						function() {
							myDropzone.removeAllFiles();
						}
					,2000);
				}
			}
		}
	);
};
function setSocketIdCookie() {
	cookiesManager.createCookie("socketID", socket.id);
};


function getFile(result) {
	var link = document.createElement("a");
	link.setAttribute("id", "download_" + result.name);
	link.setAttribute("download", result.name);
	link.setAttribute("href", result.path + result.name);
	link.innerHTML = result.name;
	createMessageElement(result.alias, link, null, true);
	console.log(result.path, result.name, result.alias);
};

socket.addEventListener("connect", setSocketIdCookie);
socket.addEventListener("reconnect", setSocketIdCookie);

hljs.initHighlighting();
document.getElementById("sendMessage").addEventListener("click", sendMessage);