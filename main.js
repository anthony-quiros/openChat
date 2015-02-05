var express = require("express");
var app = express();
var server = require('http').Server(app); 
var io = require('socket.io')(server);
var session = require("cookie-session");
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser');
var validator = require("validator");
var dl  = require('delivery');
var fs  = require('fs');
var conf = require("json-config-manager").requireModule();
var FifoArray = require("fifo-array");

var formidable = require('formidable');
var util = require('util');
var fsExtra   = require('fs-extra');
var path = require("path");
var listOfMessages = new FifoArray(conf.listOfMessagesSize);
var listOfUsers = new Array();
var folderName = conf.folderName;

app.use(cookieParser())
	.use(session({secret: 'todotopsecret'}))
	.use(bodyParser())
;
function addAlias(socket, isFirstTime, message) {
	socket.emit("alias", {"isFirstTime" : isFirstTime, "message" : message});
};
function sendListOfMessages(socket) {
	for (message in listOfMessages) {
		socket.emit("historic", listOfMessages[message]);
		console.log("Le message", message);
	};
}

function connectionListner(socket) {
	var socket = socket;
	if(null == socket.alias) {
		sendListOfMessages(socket);
		addAlias(socket, true, null);
	}
	console.log('New connection from :', socket.handshake.address);
	socket.on('message', function (message) {
		if(socket.alias) {
			if(null != message && '' != message) {
				var alias = socket.alias;
				console.log("message envoyé : ", validator.escape(message));
				socket.broadcast.emit('message', validator.escape(message), alias);
				listOfMessages.push({
					"message" : message,
					"alias" : alias
				});
				console.log("historique", listOfMessages);
			}
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



function sendFile(request, result) {
	var myRequest = request;
	var myResult = result;
	console.log("sendFile");
	 var form = new formidable.IncomingForm();
    form.parse(myRequest, function(err, fields, files) {
    	console.log("toto");
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
                    console.log("success!")
                    fsExtra.remove(temp_path);
                    io.sockets.emit("download", folderName + "/" + file_name, file_name, "test");
                }
            });
        });

 	form.on('error', function (fields, files) {
     	console.log("Erreur lors du téléchargement");
     });
     form.on('progress', function(bytesReceived, bytesExpected) {
        var percent_complete = (bytesReceived / bytesExpected) * 100;
        console.log(percent_complete.toFixed(2));
    });
    return;
};

function postSendFile(request, result){
	result.setHeader("Content-Type", "text/html");
	result.render("chat.ejs");
};

app.get("/", chat)
.post("/", sendFile)
.use(notExist)
console.log("PORT : ", conf.port);
server.listen(conf.port);