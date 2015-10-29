var http = require('http');
var jade = require('jade');
var express = require('express');
app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout : false });
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
	res.render('home.jade');
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(8888);

io.sockets.on('connection', function(socket) {
	socket.on('checkPseudo', function(data) {
		if(!isUsernameValid(data)) {	
			socket.emit('checkPseudo',{message : 'checkPseudo', pseudo : data, status : "invalid"});
			console.log("attempted to say username " + data + " is invalid");
		}
		else if(!isUsernameAvailable(data)) {
			socket.emit('checkPseudo',{message : 'checkPseudo', pseudo : data, status : "taken"});
			console.log("attempted to say username " + data + " is taken");
		}
		else {
			socket.emit('checkPseudo', {message : 'checkPseudo', pseudo : data, status : "available"});
			console.log("attempted to say username " + data + " is available");
		}
	});

	socket.on('setPseudo', function(data) {
		if(isUsernameValid(data) && isUsernameAvailable(data)) {
			socket['pseudo'] = data;
		}
		else console.log("Not valid username posted. username: " + data);
	});

	socket.on('message', function(message) {
		if(isUrlValid(message)) {
        socket.broadcast.emit('message', {
            'message' : message,
            'pseudo' : socket['pseudo']
        });
		console.log("user " + socket['pseudo'] + " send this : " + message);
		}
		else {
			console.log("Not valid url posted. url: " + message);
		}
	});
});

function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

function isUsernameValid(username) {
	return /^[a-zA-Z0-9_-]{3,16}$/.test(username);
}

function isUsernameAvailable(username) {
	for(var socketId in io.sockets.sockets) {
		if(io.sockets.sockets[socketId]['pseudo'] === username) {
			return false;
		}
	}
	return true;
}