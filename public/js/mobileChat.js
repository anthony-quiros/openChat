getImage = function(message) {}
showAliasForm = function(e) {
	$("#aliasPopin").attr("class", "");
	$("#mask").attr("class", "");
	if(null != e && null != e.toElement && "myAlias" == e.toElement.parentNode.id) {
		$("#myAlias").unbind( "click" );
	$("#myAlias").click(closeAliasForm());
	return;
	} 
	$("#write").addClass("hidden");
	
};
closeAliasForm = function(e) {
	var cookieAlias = cookiesManager.readCookie("alias");
	if(null != cookieAlias) {
		document.querySelector("#myAlias .value").innerText = cookieAlias;
		document.querySelector("#aliasPopin").setAttribute("class", "hidden");
		document.querySelector("#mask").setAttribute("class", "hidden");
		document.querySelector("#txtAlias").value = ""
		if(null != e && null != e.toElement && "myAlias" == e.toElement.parentNode.id) {
			document.querySelector("#myAlias").removeEventListener("click", closeAliasForm);
			document.querySelector("#myAlias").addEventListener("click", showAliasForm);
			return;
		}
		document.querySelector("#write").setAttribute("class", "");
	}
};
showOrHideMenu = function () {
	var menuElement = $("#menu");
	var classAttribute = menuElement.attr('class');
	if("hidden" == classAttribute || "hiddenMenu" == classAttribute) {
		menuElement.attr("class", "notHidden");
		return;
	}
	menuElement.attr("class", "hiddenMenu");
};

$( document ).load(function() {
	initDropZone(".imgUploadFile form");	
});

$( document ).ready(function() {
	initDropZone(".imgUploadFile form");	
});

createMemberElement  = function(message) {}
removeMemberElement  = function(message) {}

$('#sendAlias').click(sendAlias);
$('#showMenu').click(showOrHideMenu);
$("#myAlias").click(showAliasForm());
