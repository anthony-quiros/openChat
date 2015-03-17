var getMessage = function(message) {
	var messageToAppend = isEncHTML(message.message) ? decHTMLifEnc(message.message) : message.message;
	createMessageElement(message.alias, messageToAppend, message.date);
};

getMessageACK = function(message) {}
getImage = function(message) {}
showAliasForm = function(message) {}
getFile = function(message) {}
getAliasACK  = function(message) {}
createMemberElement  = function(message) {}
removeMemberElement  = function(message) {}
getCode  = function(message) {}
getCodeACK  = function(message) {}
