var express = require("express");
var app = express();
var server = require('http').Server(app); 
var io = require('socket.io')(server);
var cookie = require('cookie');
var bodyParser = require('body-parser');

var validator = require("validator");

var fs  = require('fs');
var conf = require("json-config-manager").requireModule();

var FifoArray = require("fifo-array");
var formidable = require('formidable');
var fsExtra   = require('fs-extra');
var util = require('util');
var path = require("path");

var LogManager = require('log-manager');
var log = LogManager.getLogger();

var historic = new FifoArray(conf.historicSize);
var listOfUsers = new Array();

var folderName = conf.folderName;

function getSocketById(id) {
	return io.sockets.connected[id];
}

function getDate() {
	var now = new Date();
	return now.getDate() +"/" + now.getUTCMonth() + "/" + now.getFullYear() + " " 
		+ now.getHours() + ":" + now.getMinutes()+ ":" + now.getMilliseconds();
}
function addAlias(socket, isFirstTime, message) {
	socket.emit("alias", {"isFirstTime" : isFirstTime, "message" : message});
};

function sendListOfAlias(socket) {
	for (alias in listOfUsers) {
		socket.emit("join", listOfUsers[alias]);
	};
}

function sendCode(socket, code) {
	var message = { message : code, alias: socket.alias, date : getDate()};
	log.info(socket.alias);
	historic.push({name : "code", value : message});
	socket.broadcast.emit("code", message);
	socket.emit("codeACK", message);
}

function checkAndAddAlias(socket, alias) {
	log.info("Votre alias :", alias);
	var aliasExist = listOfUsers.indexOf(alias) < 0;
	if(aliasExist) {
		if(null != alias && '' != alias) {
			socket.alias = alias;
			listOfUsers.push(alias);
			log.info(socket.alias);
			socket.emit("aliasACK", {alias: alias, result: true});
			var message = { message : alias + " joined", alias: alias, date : getDate()};
			socket.broadcast.emit("message", message);
			socket.broadcast.emit('join', socket.alias);
			sendListOfAlias(socket);
		} else {
			socket.emit("aliasACK", {alias: alias, result: false, message: "Can't be empty"});
		}
	} else {
		socket.emit("aliasACK", {alias: alias, result: false, message: "Is already used"});
	}
	log.info("Vos alias :", listOfUsers);
};

function sendHistoric(socket) {
	for (event in historic) {
		console.log(historic[event]);
		socket.emit(historic[event].name, historic[event].value);
	};
};
function connectionListner(socket) {
	var socket = socket;
	var requestCookie = socket.request.headers.cookie
	if(null != requestCookie) {
		var cookies = cookie.parse(requestCookie);
		log.info("vos cookies",cookies);
		if(null != cookies.alias) {
			checkAndAddAlias(socket, cookies.alias);
		}
	}
	if(null == socket.alias) {
		addAlias(socket, true, null);
	}

	log.info('New connection from :', socket.handshake.address);
	socket.on('message', function (message) {
		if(socket.alias) {
			if(null != message && '' != message) {
				var alias = socket.alias;
				log.info("message envoyé : ", validator.escape(message));
				var message = { message : validator.escape(message), alias: alias, date : getDate()};
				socket.broadcast.emit('message', message);
				socket.emit('messageACK', {message: message, result: true});
				historic.push({name : "message", value : message});
				log.info("historique", historic);
			}
		} else {
			addAlias(socket, false, "Alias !!!!!");
		}
	});

	socket.on('image', function (url, width, height){
		if(socket.alias) {
			log.info("image : ", url, "size : ", height, "x", width);
			socket.broadcast.emit('image', url, width, height);
		} else {
			addAlias(socket, false, "Alias !!!!!");
		}
	});

	socket.on("alias", function(alias) {
		checkAndAddAlias(socket, alias);
	});

	socket.on("code", function(code) {
		log.info("CODE", code);
		sendCode(socket, code);
	});

	socket.on("historic", function () {sendHistoric(socket);});
	socket.on('disconnect', function() {
		var index = listOfUsers.indexOf(socket.alias);
		if(index >= 0) {
			listOfUsers.splice(index, 1);
			var message = { message : socket.alias + " left", alias: socket.alias, date : getDate()};
			socket.broadcast.emit('message', message);
			socket.broadcast.emit('left', socket.alias);
	    	log.info(socket.alias, 'has left');
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
	var MobileDetect = require('mobile-detect'),
    md = new MobileDetect(request.headers['user-agent']);
	if(null == md.mobile()){
		result.render("chat.ejs");	
	}
	else{
		result.render("mobileChat.ejs");
	}
};



function sendFile(request, result) {
	var requestCookie = request.headers.cookie
	if(null != requestCookie) {
		var cookies = cookie.parse(requestCookie);
		log.info("cookie", cookies.socketID);
		var socket = getSocketById(cookies.socketID);
		if(null != socket && null != socket.alias) {
			var myRequest = request;
			var myResult = result;
			 var form = new formidable.IncomingForm();
		    form.parse(myRequest, function(err, fields, files) {
			log.info("upload started");
		      myResult.writeHead(200, {'content-type': 'text/plain'});
		      myResult.write('received upload:\n\n');
		      myResult.end(util.inspect({fields: fields, files: files}));
		    });
		    form.on('end', function (fields, files) {
		            /* Temporary location of our uploaded file */
		            var temp_path = this.openedFiles[0].path;
		            /* The file name of the uploaded file */
		            var file_name = this.openedFiles[0].name;
		            /* Location where we want to copy the uploaded file */
		            var new_location = path.join(__dirname, "public/" + folderName + "/");
		            fsExtra.copy(temp_path, new_location + file_name, function (err) {
		                if (err) {
		                    console.error(err);
		                } else {
		                    log.info("success!")
		                    fsExtra.remove(temp_path);
		                    downloadValueWithAlias = {path : folderName + "/" , name : file_name , alias : socket.alias};
		                    downloadValueWithoutAlias = {path : folderName + "/" , name : file_name , alias : null};
		                    historic.push({name : "download", value : downloadValueWithAlias});
		                    socket.broadcast.emit("download", downloadValueWithAlias);
		                    socket.emit("downloadACK", downloadValueWithoutAlias);
		                }
		            });
		        });

		 	form.on('error', function (fields, files) {
		     	log.info("Erreur lors du téléchargement");
		     });
		     form.on('progress', function(bytesReceived, bytesExpected) {
		        var percent_complete = (bytesReceived / bytesExpected) * 100;
		        log.info(percent_complete.toFixed(2));
		    });
		    return;
    	}
	}
};


app.get("/", chat)
.post("/", sendFile)
.use(notExist)
log.info("PORT : ", conf.port);
server.listen(conf.port);