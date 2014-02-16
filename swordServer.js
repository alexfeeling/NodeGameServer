var net = require('net');
var allSockets = [];
var server = net.createServer(function(socket) {
	allSockets.push(socket);
	console.log('a client connect');
	socket.on('data', function(data){
		var offset = 0;
		while(offset < data.length) {
			var type = data.readInt8(offset);
			var len = data.readInt8(offset+1);
			var str = data.toString('utf8', offset+2, offset+len+2);
			console.log('received type:' + type + ', data:' + str);
			offset += len+2;
		}
		console.log(offset + ',' + data.length);
		for (var i = 0; i < 100; i++) {
			var str = "hello client!" + i;
			var buffer = new Buffer(1 + str.length);
			buffer.writeInt8(str.length, 0);
			buffer.write(str, 1, str.length);
			//console.log(socket._connecting);
			//if (!socket._connecting) break;
			socket.write(buffer);
			buffer.length = 0;
		}
	});
	socket.on('end', function(){
		console.log('a client end');
		if (!socket.destroyed) socket.destroy();
		var idx = allSockets.indexOf(socket);
		if (idx >= 0) {
			allSockets.splice(idx, 1);
		}
	});
	
	socket.on('close', function(had_error){
		if (had_error) {
			console.log('a client close on error');
		}
		var idx = allSockets.indexOf(socket);
		if (idx >= 0) {
			allSockets.splice(idx, 1);
		}
	});
	socket.on('error', function(error) {
		console.log('error:' + error);
		socket.close();
	});
	//var i = 0;
	//for (i = 0; i < 100; i++) {
		//var str = "hello client" + i;
		//var buffer = new Buffer(str.length*2+1);
		//console.log(str.length * 2+1);
		//buffer.write(str.length * 2 + 1);
		//buffer.write(str);
		//socket.write(buffer);
		//buffer.length = 0;
	//}
});
server.listen(8899, function(){
	console.log('server listening');
});