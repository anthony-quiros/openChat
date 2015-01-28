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