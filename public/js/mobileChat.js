getImage = function(message) {}
showAliasForm = function(e) {
	$("#aliasPopin").setAttribute("class", "");
	$("#mask").setAttribute("class", "");
	if(null != e && null != e.toElement && "myAlias" == e.toElement.parentNode.id) {
		$("#myAlias").removeEventListener("click", showAliasForm);
	$("#myAlias").addEventListener("click", closeAliasForm);
	return;
	} 
	$("#write").setAttribute("class", "hidden");
	
};
closeAliasForm = function(e) {
	$("#aliasPopin").setAttribute("class", "hidden");
	$("#mask").setAttribute("class", "hidden");
	$("#myAlias .value").innerText = cookiesManager.readCookie("alias");
	$("#txtAlias").value = ""
	if(null != e && null != e.toElement && "myAlias" == e.toElement.parentNode.id) {
		$("#myAlias").removeEventListener("click", closeAliasForm);
		$("#myAlias").addEventListener("click", showAliasForm);
		return;
	}
	$("#write").setAttribute("class", "");
};
showOrHideMenu = function () {
	var menuElement = $("#menu");
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
$("#myAlias").addEventListener("click", showAliasForm);