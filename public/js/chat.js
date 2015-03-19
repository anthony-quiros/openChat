var myDropzone;
var privateAlias;
var emoticons = [
	[":)","Veryhappy.gif"],
	[":s","dizzy.gif"],
	[":o","outraged.gif"],
	[":(","sad.gif"],
	[";)","wink.gif"]
]

//Un tableau contenant l'ensemble des touches pressées par l'utilisateur
var keys = {};
function getListOfMessages() {
	return document.getElementById("listOfMessages");
};

function removeMemberElement(alias) {
	var member = document.getElementById("member"+alias);
	if(null != member) {
		member.remove();
	}
}

function createMemberElement(alias) {
	if(null == document.getElementById("member"+alias) && alias != privateAlias) {
		var list = document.getElementById("contentLeftTop");
		var memberElement = document.createElement("div");
		var avatarElement = document.createElement("div");
		var aliasElement = document.createElement("span");
		memberElement.setAttribute("id", "member"+alias);
		memberElement.setAttribute("class", "member");
		avatarElement.setAttribute("class", "avatar");
		aliasElement.setAttribute("class", "alias");
		aliasElement.innerHTML = alias;
		memberElement.appendChild(avatarElement);
		memberElement.appendChild(aliasElement);
		list.appendChild(memberElement);
	}
}

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

function getImage(url, height, width) {
	var list = document.getElementById("listOfMessages");
	list.appendChild(createImgElement(url, height, width));
	list.appendChild(createBrElement());
}

function showAliasForm (request) {
	if(!request.isFirstTime) {
		$('.alias #errorMessage').text = request.message;
		console.log(request.message);
	}
	$('#showAliasForm').click();;

};

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
};

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
	
	//Popin d'envoi de code
	$('#selectLanguageToHighLight').fancybox({

		fitToView	: false,
		autoSize	: false,
		closeClick	: false,
		openEffect	: 'none',
		closeEffect	: 'none',
		beforeShow:function(){	
			$("#sendCodeMessage").click(function() {
				var language = $("input[name=group1]:checked").val();
				var message = "<pre><code class=\"hljs  "+language+"\">" + document.querySelector("#codeEnter").innerHTML + "</code></pre>";
				var messageToAppend = isEncHTML(message) ? decHTMLifEnc(message) : message;
				socket.emit("code", messageToAppend);
				$("#codeEnter").html("");
				$.fancybox.close();
			});
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

$( document ).load(function() {
	initDropZone("#contentLeftBottom form");	
});

$( document ).ready(function() {
	initChatPopins();
	initTextDivWithSmileys();
	initDropZone("#contentLeftBottom form");	
});

/** Upload d'un fichier sur le serveur (par défaut dans le repertoire *uploads/file **/
$("#sendFile").submit(function(e){
 
    var formObj = $(this);
    var formData = new FormData(this);
    $.ajax({
        url: "/",
    type: 'POST',
        data:  formData,
    mimeType:"multipart/form-data",
    contentType: false,
        cache: false,
        processData:false,
    success: function(data, textStatus, jqXHR) {
 				console.log("upload ok");
    		},
     error: function(jqXHR, textStatus, errorThrown) {
     			console.log("upload ko");
          }         
    });
    e.preventDefault(); //Prevent Default action. 
    return false;
}); 


/** Sur une pression de touche on ajoute une entrée correspondante dans un tableau **/
$(document).keydown(function (e){
    keys[e.which] = true;
	//Code 13 = enter, Code 17 = CTRL
	if(keys[13] && keys[17]){
		sendMessage();
	}
});
function closeAliasForm() {
	$('.fancybox-close').click();
}
/**On supprime l'entrée correspondant à la touche relachée dans le tableau des touches pressées **/
$(document).keyup(function (e) {
    delete keys[e.which];
});
