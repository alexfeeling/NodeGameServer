var net = require('net');
var allSockets = [];
var SERVER_HOST = "192.168.1.100";
var SERVER_PORT = 61345;
var server = net.createServer(onSocketConnect);
server.listen(SERVER_PORT, SERVER_HOST, function(){
	console.log('server listening');
});

function closeClient(socket) {
	if (socket.connected) {
		socket.close();
	}
	var idx = allSockets.indexOf(socket);
	if (idx >= 0) {
		allSockets.splice(idx, 1);
	}
}

function onSocketConnect(socket) {
	allSockets.push(socket);
	console.log('a client connect');
	socket.on('data', function onSocketData(data) {
		var offset = 0;
		while(offset < data.length) {
			var dataLen = data.readInt32(offset);
			offset += 4;
			var dataStr = data.toString('utf8', offset, offset + dataLen);
			offset += dataLen;
			var dataObj = encodeData(dataStr);
			switch(dataObj.name) {
				case 'login'://登录
					loginHandler(dataObj);
					break;
				case 'register'://注册
					
					break;
				case 'move'://行走，前进后退
					
					break;
				case 'turn'://转弯
					
					break;
			}
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
		closeClient(socket);
	});
	socket.on('error', function(error) {
		console.log('error:' + error);
		socket.destroy();
		closeClient(socket);
	});
	
	function loginHandler(dataObj) {
		if (dataObj.un == 'alex' && dataObj.psw == '1234') {
			
		} 
	}
}



///编码数据
function codeData(vData:Object):String {
	if (vData == null) {
		return "";
	}
	var resultList = [];
	for (var key in vData) {
		resultList.push(key + "=" + vData[key]);
	}
	return resultList.join("&");
}

///解码数据
function encodeData(str) {
	var dataArr = str.split('&');
	var resultData = {};
	for (var i = 0; i < dataArr.length; i++) {
		var keyVal = dataArr[i].split('=');
		resultData[keyVal[0]] = keyVal[1];
	}
	return resultData;
}











