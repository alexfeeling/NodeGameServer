var net = require('net');
var Client = require('./client');
var SERVER_HOST = "192.168.1.100";
var SERVER_PORT = 61345;
function Engine() {
	var allClients = {};
	
	var server = net.createServer(function onSocketConnect(socket) {
		console.log('a client connect');
		var client = new Client(socket);
		allClients[client.id] = client;
	});
	server.listen(SERVER_PORT, SERVER_HOST, function(){
		console.log('server listening');
	});

	this.closeClient = function closeClient(client) {
		if (allClients[client.id]) {
			allClients[client.id] = null;
			delete allClients[client.id];
		}
	}
	
	this.sendBroadcast = function(data, ignoreClient) {
		allClients.forEach(function(client) {
			if (client.id != ignoreClient.id) {
				client.sendData(data);
			}
		});
	}
}

module.exports = Engine;













