var socket = io.connect(window.location.host);
var emoticons = [
	[":)","Veryhappy.gif"],
	[":s","dizzy.gif"],
	[":o","outraged.gif"],
	[":(","sad.gif"],
	[";)","wink.gif"]
]

var getMessage = function(message, alias) {
	var messageToAppend = isEncHTML(message) ? decHTMLifEnc(message) : message;
	$("#listOfMessages").append("<br/><b>" + alias + " :</b> " + messageToAppend);
	Prism.highlightAll();
};

function sendImage() {
	var list = document.getElementById("listOfMessages");
	var imgWidth = parseInt($("#imgWidth").val()) > 0 ? $("#imgWidth").val() : "200";
	var imgHeight = parseInt($("#imgHeight").val()) > 0 ? $("#imgHeight").val() : "300";
	var url = $("#valueImg").val();
	socket.emit("image", $("#valueImg").val(), imgHeight, imgWidth);
	list.appendChild(createImgElement(url, imgHeight, imgWidth));
	list.appendChild(createBrElement());
}

function createImgElement(url, height, width) {
	var imgElement = document.createElement("img");
	imgElement.setAttribute("src", url);
	imgElement.setAttribute("height", height + "px");
	imgElement.setAttribute("width", width + "px");
	return imgElement;
}
function createBrElement() {
	return document.createElement("br");
}

function getImage(url, height, width) {
	var list = document.getElementById("listOfMessages");
	list.appendChild(createImgElement(url, height, width));
	list.appendChild(createBrElement());
}

function sendMessage() {
	var message = $("#message").html();
	var messageToAppend = isEncHTML(message) ? decHTMLifEnc(message) : message;
	socket.emit("message", messageToAppend);
	$("#listOfMessages").append("<br/>" + messageToAppend);
	$("#message").html("");
	
	//On rafraichit la colorisation syntaxique
	Prism.highlightAll();
}

function showAliasForm (request) {
	if(!request.isFirstTime) {
		$('.alias #errorMessage').text = request.message;
		console.log(request.message);
	}
	$('#showAliasForm').click();;

};

function sendAlias() {
	var alias = $('#txtAlias').val();
	if('' != alias) {
		socket.emit('alias', alias);
		$('.fancybox-close').click();
	}
}
function createEmoticonElement(fileName) {
	var elt = document.createElement("img");
	elt.setAttribute("src", fileName);
	return elt;
}
function getFile(fileUrl, fileName, alias) {
	var link = document.createElement("a");
	link.setAttribute("id", "download_" + fileName);
	link.setAttribute("download", fileName);
	link.setAttribute("href", fileUrl);
	link.innerText= alias + " : Télécharger : " + fileName;
	$("#listOfMessages").each(function() {
		this.appendChild(link);
	});
}
socket.on('message', getMessage);
socket.on('image', getImage);
socket.on("alias", showAliasForm);
socket.on("download", getFile);
/*socket.on("alias", sendAlias);*/
document.getElementById("sendMessage").addEventListener("click", sendMessage);

/** Initialisation des div éditables et gestion des émoticones dans l'input associé. **/
function initTextDivWithSmileys(){
	$('.editable').each(function(){
		this.contentEditable = true;
	});
	$("#message").keyup(function(){
		for (i = 0; i < emoticons.length; ++i) {
			if($(this).html().indexOf(emoticons[i][0]) >= 0){
				$("#message").each(function() {
					this.appendChild(createEmoticonElement('images\\smileys\\'+ emoticons[i][1]));
				});
				$('#message').html($('#message').html().replace(emoticons[i][0], ''));
				
				// Déplace le curseur juste après l'insertion de l'emoticone dans la div editable
				var range = window.getSelection().getRangeAt($("#message").children()[$("#message").children().length-1]);
				range.setStartAfter($("#message").children()[$("#message").children().length-1]);
				window.getSelection().removeAllRanges();
				window.getSelection().addRange(range);
			}
		}
	});
}

/** Génération du tableau contenant la liste des emoticons et raccourcis disponibles **/
function generateTable(){
	var html = "<table><tr><td><b>Raccourci</b></td><td><b>Smiley</b></td></tr>";
	for (i = 0; i < emoticons.length; ++i) {
		html += "<tr>";
		for (j = 0; j < 2; ++j) {
			html += "<td>";
			if( j == 0 ){
				//Nous sommes sur la premiere colonne (raccourci)
				html += emoticons[i][j];
			}
			else{
				//Nous sommes sur la seconde colonne (image de l'émoticone)
				html += "<img src=\"images\\smileys\\"+ emoticons[i][j] +"\" />";
			}
			html += "</td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	return html;
}
/** Initialisation des popins du chat **/
function initChatPopins(){
	// Popin d'insertion d'image
	$('.sendImage').fancybox({
			minWidth	: 520,
			minHeight	: 25,
			width	: 520,
			height	: 25,
			fitToView	: false,
			autoSize	: false,
			closeClick	: false,
			openEffect	: 'none',
			closeEffect	: 'none',
			beforeShow:function(){
				$('#sendImg').click(sendImage);
			}
	});
	
	//Popin de saisie d'alias
	$('#showAliasForm').fancybox({
		minWidth	: 520,
		minHeight	: 25,
		width	: 520,
		height	: 25,
		fitToView	: false,
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none',
		beforeShow:function(){
			$('#sendAlias').click(sendAlias);
		}
	});
	
	$('.showEmoticons').fancybox({
			minWidth	: 140,
			minHeight	: 200,
			width	: 140,
			height	: 200,
			fitToView	: false,
			autoSize	: false,
			closeClick	: false,
			openEffect	: 'none',
			closeEffect	: 'none',
			beforeShow:function(){
				$('#showEmoticons').append(
				"<table>" + generateTable() +"</table>"
				);
				$('#showEmoticons tr img').click(function () { 
					var src = this.getAttribute("src");
					$("#message").each(function() {
						this.appendChild(createEmoticonElement(src));
						$('.fancybox-close').click();
					});
				});
			}
	});
}

/** Upload d'un fichier sur le serveur (par défaut dans le repertoire *uploads/file **/
$(function(){  
  socket.on('connect', function(){
    var delivery = new Delivery(socket);

    delivery.on('delivery.connect',function(delivery){
      $("input[type=submit]").click(function(evt){
        var file = $("input[type=file]")[0].files[0];
        delivery.send(file);
        evt.preventDefault();
      });
    });
	delivery.on('send.success',function(fileUID){
    console.log("Fichier uploadé avec succès");
    });
  });
});

$( document ).ready(function() {
	initChatPopins();
	initTextDivWithSmileys();
});