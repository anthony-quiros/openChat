getImage = function(message) {}
showAliasForm = function() {
	document.querySelector("#aliasPopin").setAttribute("class", "");
	document.querySelector("#write").setAttribute("class", "hidden");
};
closeAliasForm = function() {
	document.querySelector("#aliasPopin").setAttribute("class", "hidden");
	document.querySelector("#write").setAttribute("class", "");
};
showOrHideMenu = function () {
	var menuElement = document.querySelector("#menu");
	var classAttribute = menuElement.getAttribute("class");
	if("hidden" == classAttribute) {
		menuElement.setAttribute("class", "");
		return;
	}
	menuElement.setAttribute("class", "hidden");
};

$( document ).load(function() {
	initDropZone(".imgUploadFile form");	
});

$( document ).ready(function() {
	initDropZone(".imgUploadFile form");	
});

getFile = function(message) {}
createMemberElement  = function(message) {}
removeMemberElement  = function(message) {}

$('#sendAlias').click(sendAlias);
$('#showMenu').click(showOrHideMenu);