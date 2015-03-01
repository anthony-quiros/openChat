/** Determine si la chaine passée en argument est encodée (urlEncode)**/
function isEncHTML(str) {
  if(str.search(/&amp;/g) != -1 || str.search(/&lt;/g) != -1 || str.search(/&gt;/g) != -1 || str.search(/&quot;/g) != -1 || str.search(/&#x2F;/g) != -1){
	 return true;
  }
  return false;
};
 
/** Permet de décoder la chaine encodée (urlEncore)**/
function decHTMLifEnc(str){
    if(isEncHTML(str)){
		return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x2F;/g,'/');
	} 
    return str;
}

var cookiesManager = {

	createCookie : function (name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	},

	readCookie : function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	},

	eraseCookie : function (name) {
		createCookie(name,"",-1);
	}
}