var net = require('net');
var util = require('util')
var Client = require('./client');
var SocketPackage = require('./socketPackage');
var SERVER_HOST = "192.168.1.192";
var SERVER_PORT = 61345;
var allClients = {};
function start() {
	
	var server = net.createServer(function onSocketConnect(socket) {
		console.log('a client connect::' + socket.remoteAddress + ':' + socket.remotePort);
		var addressObj = socket.address();
		//console.log('local::' + addressObj.address+ ':'+addressObj.port);
		var client = new Client(socket);
		allClients[client.id] = client;
		
		//var pack = new SocketPackage();
		//pack.code = 100;
		//pack.data = [socket.remotePort, socket.remoteAddress];
		//sendBroadcast(pack, client);
	});
	server.listen(SERVER_PORT, SERVER_HOST, function(){
		console.log('server listening');
	});
}
function closeClient(clientId) {
	if (allClients[clientId]) {
		console.log('close client:' + clientId);
		allClients[clientId] = null;
		delete allClients[clientId];
	}
}
function sendBroadcast (data, ignoreClientId) {
	for (var id in allClients) {
		var client = allClients[id];
		if (client.id != ignoreClientId) {
			console.log(client.id, ignoreClientId);
			console.log('send to client:' + id);
			client.sendData(data);
		}
	}
}

exports.start = start;
exports.closeClient = closeClient;
exports.sendBroadcast = sendBroadcast;













