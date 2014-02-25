var engine = require('./engine');
var idCount = 0;
function Client(socket) {
	this.id = idCount++;
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
		//if (!socket.destroyed) socket.destroy();
		//var idx = allSockets.indexOf(socket);
		//if (idx >= 0) {
			//allSockets.splice(idx, 1);
		//}
		engine.closeClient(this);
	});
	
	socket.on('close', function(had_error){
		if (had_error) {
			console.log('a client close on error');
		}
		socket.destroy();
		engine.closeClient(this);
	});
	
	socket.on('error', function(error) {
		console.log('error:' + error);
		socket.destroy();
		engine.closeClient(this);
	});
	
}
module.exports = Client;

function loginHandler(dataObj) {
	if (dataObj.un == 'alex' && dataObj.psw == '1234') {
		
	} 
}

///编码数据
function codeData(vData) {
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