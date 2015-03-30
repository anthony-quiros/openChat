getImage = function(message) {}
showAliasForm = function(e) {
	document.querySelector("#aliasPopin").setAttribute("class", "");
	document.querySelector("#mask").setAttribute("class", "");
	if(null != e && null != e.toElement && "myAlias" == e.toElement.parentNode.id) {
		document.querySelector("#myAlias").removeEventListener("click", showAliasForm);
	document.querySelector("#myAlias").addEventListener("click", closeAliasForm);
	return;
	} 
	document.querySelector("#write").setAttribute("class", "hidden");
	
};
closeAliasForm = function(e) {
	document.querySelector("#aliasPopin").setAttribute("class", "hidden");
	document.querySelector("#mask").setAttribute("class", "hidden");
	document.querySelector("#myAlias .value").innerText = cookiesManager.readCookie("alias");
	document.querySelector("#txtAlias").value = ""
	if(null != e && null != e.toElement && "myAlias" == e.toElement.parentNode.id) {
		document.querySelector("#myAlias").removeEventListener("click", closeAliasForm);
		document.querySelector("#myAlias").addEventListener("click", showAliasForm);
		return;
	}
	document.querySelector("#write").setAttribute("class", "");
};
showOrHideMenu = function () {
	var menuElement = document.querySelector("#menu");
	var classAttribute = menuElement.getAttribute("class");
	if("hidden" == classAttribute || "hiddenMenu" == classAttribute) {
		menuElement.setAttribute("class", "notHidden");
		return;
	}
	menuElement.setAttribute("class", "hiddenMenu");
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
document.querySelector("#myAlias").addEventListener("click", showAliasForm);