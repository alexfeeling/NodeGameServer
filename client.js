var Engine = require('./engine');
var run = require('./run');
var idCount = 0;

function Client(socket) {
	var engine = run.engine;
	var id = idCount + '';
	idCount++;
	var x = 0;
	var y = 0;
	var rotation = 0;
	
	function sendData (data) {
		var dataStr = codeData(data);
		var dlen = dataStr.length;
		var buf = new Buffer(4 + Buffer.byteLength(dataStr));
		console.log(dlen +":::" + dataStr);
		buf.writeInt32LE(dlen, 0);
		buf.write(dataStr);
		socket.write(buf, 'utf8');
	}
	
	socket.on('data', function onSocketData(data) {
		var offset = 0;
		while(offset < data.length) {
			var dataLen = data.readInt32LE(offset);
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
					moveHandler(dataObj);
					break;
				case 'turn'://转弯
					
					break;
			}
		}
	});
	
	socket.on('end', function(){
		console.log('a client end');
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
	
	function loginHandler(dataObj) {
		if (dataObj.un == 'alex' && dataObj.psw == '1234') {
			console.log('login success ' + dataObj);
			sendData( { name:'login_rep', id:id } );
		} 
		
	}

	function moveHandler(dataObj) {
		console.log('move to:' + dataObj.x +',' + dataObj.y); 
		
	}
	
	this.id = id;
	this.x = x;
	this.y = y;
	this.rotation = rotation;
	this.sendData = sendData;
}
module.exports = Client;

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