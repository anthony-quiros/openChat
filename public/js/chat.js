var socket = io.connect(window.location.host);
var emoticons = [
	[":)","Veryhappy.gif"],
	[":s","dizzy.gif"],
	[":o","outraged.gif"],
	[":(","sad.gif"],
	[";)","wink.gif"]
]

var getMessage = function(message) {
	var messageToAppend = isEncHTML(message) ? decHTMLifEnc(message) : message;
	$("#listOfMessages").html("<br/>" + messageToAppend);
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
	console.log(message);
	socket.emit("message", message);
	var list = document.getElementById("listOfMessages");
	list.innerHTML = list.innerHTML + "<br/>" + message;
	$("#message").html("");
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
socket.on('message', getMessage);
socket.on('image', getImage);
socket.on("alias", showAliasForm);
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
				$("#message").append('<img src=\"images\\smileys\\'+ emoticons[i][1] +'\" />');
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

/** Determine si la chaine passée en argument est encodée (urlEncode)**/
function isEncHTML(str) {
  if(str.search(/&amp;/g) != -1 || str.search(/&lt;/g) != -1 || str.search(/&gt;/g) != -1 || str.search(/&quot;/g) != -1){
	 return true;
  }
  return false;
};
 
/** Permet de décoder la chaine encodée (urlEncore)**/
function decHTMLifEnc(str){
    if(isEncHTML(str)){
		return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
	} 
    return str;
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
			}
	});
}

$( document ).ready(function() {
	initChatPopins();
	initTextDivWithSmileys();
});