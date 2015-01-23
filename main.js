var express = require("express");
var app = express();
var server = require('http').Server(app); 
var io = require('socket.io')(server);
var session = require("cookie-session");
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var listOfAlias = new Array();
/*var config = require("jsonconfig");*/

app.use(cookieParser())
	.use(session({secret: 'todotopsecret'}))
	.use(bodyParser())
;
function addAlias(socket){
	socket.emit("alias", "Sign in");
};

function getAlias(alias) {
	socket.alias = alias;
};

function connectionListner(socket) {
	if(null == socket.alias) {
		addAlias(socket);
	}
	console.log('Un client');
	socket.on('message', function (message){
		console.log("message envoyé : "+ message);
		socket.broadcast.emit('message', message);
	});
	socket.on("alias", getAlias);
};

function messageListner(message, socket) {
	if(null != socket.alias) {
		socket.broadcast.emit('message', message);
	} else {
		addAlias();
	}
};

io.sockets.on('connection', connectionListner);
app.use(express.static(__dirname + '/public'));

var index = function(request, result){
	result.setHeader("Content-Type", "text/plain");
	result.end("Tu es sur l'index pauvre fou!");
};

var notExist = function(request, result) {
	result.setHeader("Content-Type", "text/plain");
	result.end("Il n'y a pas de page!");
};

//Avec des paramètres
var withParams = function(request, result) {
	db.addUser(request.params.alias, request.params.password, 'USER');
	result.setHeader("Content-Type", "text/plain");
	result.end('INSERT OK');
	/*result.setHeader("Content-Type", "text/html");
	result.render("personne.ejs",{nom : request.params.nom, prenom : request.params.prenom});*/
};


var showList = function(request, result){
	var myList = request.session.list;
	request.session.list=myList;
	result.setHeader("Content-Type", "text/html");
	result.render("showList.ejs",{list : myList});
};

var addElementToList = function(request, result){
	var value = request.body.value;
	if(null != value) {
		console.log(value);
		var list = request.session.list;
		list.push(value);
		request.session.list=list;
		console.log(request.session.list);
		showList(request, result);
	} else {
		index(request, result);
	}
};
var deleteElementToList = function(request, result) {
	var list = request.session.list;
		list.splice(request.params.id, 1);
		request.session.list=list;
		result.redirect("/list");
}

var chat = function(request, result){
	result.setHeader("Content-Type", "text/html");
	result.render("chat.ejs");
};




app.get("/", index)
.post("/list", addElementToList)
.get("/list", showList)
.get("/list/delete/:id", deleteElementToList)
.get("/chat", chat);
server.listen(80);

