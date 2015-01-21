// Ici on fait un appel à la bibliothèque http de node.js
var http = require("http");
var url = require("url");
var querystring = require("querystring");
var rout = 
	function(request, result) {
		var page = url.parse(request.url).pathname;
		// Pour récupérer l'ensemble des paramètres passés dans l'url
		var params = querystring.parse(url.parse(request.url).query); 
		if(page  == "/index") {
			result.writeHead(200, {"Content-Type" : "text/html"});
			result.end("<html><p>Salut mon gars, tu es sur l'index?</p><br/><b>" + page + "</b></html>");
		} else {
			result.writeHead(404, {"Content-Type" : "text/html"});
			result.end("<html><p>Salut mon gars, tu veux mourir?</p><br/>La page n'existe pas pauvre fou!<br/><b>" + page + "</b></html>");
		
		}
		
	};
// Création du serveur, on lui donne en paramètre la function qui sera associé à l'envent request.
var server = http.createServer(rout);
// On lance le serveur sur le port n°x
server.listen(80);
