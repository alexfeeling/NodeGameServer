var net = require('net');
var Client = require('./client');

function Engine() {
	var allSockets = [];
	var allClients = {};
	var SERVER_HOST = "192.168.1.100";
	var SERVER_PORT = 61345;
	var server = net.createServer(onSocketConnect);
	server.listen(SERVER_PORT, SERVER_HOST, function(){
		console.log('server listening');
	});

	function closeClient(client) {
		//var socket = client.socket;
		//if (socket.connected) {
			//socket.close();
		//}
		if (allClients[client.id]) {
			allClients[client.id] = null;
			delete allClients[client.id];
		}
	}

	function onSocketConnect(socket) {
		//allSockets.push(socket);
		console.log('a client connect');
		var client = new Client(socket);
		allClients[client.id] = client;
	}
}
var engine = new Engine();
module.exports = engine;













