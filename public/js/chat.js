var socket = io.connect(window.location.host);
var getMessage = function(message) {
	var list = document.getElementById("listOfMessages");
	list.innerHTML = list.innerHTML + "<br/>" + message;
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


function initTextDivWithSmileys(){
	$('.editable').each(function(){
		this.contentEditable = true;
	});
	
	$("#message").keyup(function(){	
		if($(this).html().indexOf(':)') >= 0){	
			$("#message").append('<img src=\"images\\smileys\\Veryhappy.gif\" />');
			$('#message').html($('#message').html().replace(':)', ''));
			
			// Déplace le curseur juste après l'insertion de l'emoticone dans la div editable
			var range = window.getSelection().getRangeAt($("#message").children()[$("#message").children().length-1]);
			range.setStartAfter($("#message").children()[$("#message").children().length-1]);
			window.getSelection().removeAllRanges();
			window.getSelection().addRange(range);
		}
	});
}

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
		closeEffect	: 'none',
		beforeShow:function(){
			$('#sendImg').click(sendImage);
		}
	});

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
	
	initTextDivWithSmileys();
});