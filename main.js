var express = require("express");
var app = express();
var server = require('http').Server(app); 
var io = require('socket.io')(server);
var session = require("cookie-session");
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var validator = require("validator");
var conf = require("jsonconfig").requireModule();
var listOfUsers = new Array();

app.use(cookieParser())
	.use(session({secret: 'todotopsecret'}))
	.use(bodyParser())
;
function addAlias(socket, isFirstTime, message) {
	socket.emit("alias", {"isFirstTime" : isFirstTime, "message" : message});
};


function connectionListner(socket) {
	var socket = socket;
	if(null == socket.alias) {
		addAlias(socket, true, null);
	}
	console.log('New connection from :', socket.handshake.address);
	socket.on('message', function (message) {
		if(socket.alias) {
			console.log("message envoyé : "+ validator.escape(message));
			socket.broadcast.emit('message', validator.escape(message));
		} else {
			addAlias(socket, false, "Alias !!!!!");
		}
	});

	socket.on('image', function (url, width, height){
		if(socket.alias) {
			console.log("image : ", url, "size : ", height, "x", width);
			socket.broadcast.emit('image', url, width, height);
		} else {
			addAlias(socket, false, "Alias !!!!!");
		}
	});

	socket.on("alias", function(alias) {
		if(!socket.alias) {
			console.log("Votre alias :", alias);
			console.log("Vos alias :", listOfUsers);
			var aliasExist = listOfUsers.indexOf(alias) < 0;
			if(aliasExist) {
				if(null != alias && '' != alias) {
					socket.alias = alias;
					listOfUsers.push(alias);
					console.log(socket.alias);
				} else {
					addAlias(socket, false, "Try again");
				}
			} else {
				addAlias(socket, false, alias + " is already used");
			}
		}
	});
	socket.on('disconnect', function() {
		var index = listOfUsers.indexOf(socket.alias);
		if(index >= 0) {
			listOfUsers.splice(index, 1);
	    	console.log(socket.alias, 'has left');
		}
   });
};

io.sockets.on('connection', connectionListner);
app.use(express.static(__dirname + '/public'));


var notExist = function(request, result) {
	result.setHeader("Content-Type", "text/plain");
	result.end("Not Found !");
};


var chat = function(request, result){
	result.setHeader("Content-Type", "text/html");
	result.render("chat.ejs");
};




app.get("/", chat)
.use(notExist)
console.log("PORT : ", conf.port);
server.listen(conf.port);

