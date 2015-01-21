var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var session = require("cookie-session");
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var listOfalias= new Array();
var db = require('db');

app.use(cookieParser())
.use(session({secret: 'todotopsecret'}))
.use(bodyParser());

io.sockets.on('connection', function (socket) {
	db.addUser('salut', 'mon', 'toto');
	var getUserEvent = db.getUser("aquiros", "aquiros");
	getUserEvent.on('success', function(result){console.log(result)});
    console.log('Un client est connecté !');
    socket.emit("alias", "Alias please ?");

	socket.on('message', function (message) {
		socket.broadcast.emit('message', "message from " + socket.handshake.address +": " + message);
	});

	socket.on('alias', function (alias) {
		if(listOfalias.indexOf(alias)<0) {
			this.alias = alias;
			console.log(listOfalias);
			listOfalias.push(alias);
			console.log(listOfalias);
			console.log(this.alias);
		} else {
			 socket.emit("alias", "Alias please ?");
		}
	});

});
app.use(express.static(__dirname + '/public'));
var createList = function (request, result, next) {
	if(null == request.session.list) {
		request.session.list = new Array();
	}
	next();
}
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

app.use(createList)
.get("/", index)
.get("/addUser/:alias/:password", withParams)
.post("/list", addElementToList)
.get("/list", showList)
.get("/list/delete/:id", deleteElementToList)
.get("/chat", chat)
.use(notExist);
server.listen(80);

