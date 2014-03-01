var engine = require('./engine');
var util = require('util');
var SocketPackage = require('./socketPackage');
var idCount = 0;

function Client(socket) {
	var id = idCount + '';
	var mapX = 0;
	var mapY = 0;
	var x = 0;
	var y = 0;
	var rotation = 0;
	idCount++;
	
	var nat_port = 0;
	var nat_address = '';
	
	function sendData(pack) {
		var dataStr = codeData(pack.data);
		var dlen = dataStr.length;
		var buf = new Buffer(4 + Buffer.byteLength(dataStr));
		buf.writeUInt16BE(pack.code, 0);
		buf.writeUInt16BE(dlen, 2);
		buf.write(dataStr, 4);
		socket.write(buf, 'utf8');
		buf.length = 0;
	}
	
	socket.on('data', function onSocketData(data) {
		var offset = 0;
		while (offset < data.length) {
			var pack = new SocketPackage();
			pack.code = data.readUInt16BE(offset);
			offset += 2;
			var dataLen = data.readUInt16BE(offset);
			offset += 2;
			var dataStr = data.toString('utf8', offset, offset + dataLen);
			offset += dataLen;
			pack.data = encodeData(dataStr);
			switch(pack.code) {
				case 0://登录
					loginHandler(pack.data);
					break;
				case 1://注册
					
					break;
				case 2://行走，前进后退
					moveHandler(dataList);
					break;
				case 3://转弯
					
					break;
			}
		}
	});
	
	socket.on('end', function(){
		console.log('a client end');
		engine.closeClient(id);
	});
	
	socket.on('close', function(had_error) {
		console.log('a client close');
		if (had_error) {
			console.log('a client close on error');
			socket.destroy();
			engine.closeClient(exports.id);
		}
	});
	
	socket.on('error', function(error) {
		console.log('error:' + error);
		socket.destroy();
		engine.closeClient(exports.id);
	});
	
	function loginHandler(dataList) {
		if (dataList[0]== 'alex' && dataList[1] == '1234') {
			console.log('login success ' + dataList);
			var pack = new SocketPackage();
			pack.code = 0;
			pack.data = [1, exports.id];
			sendData(pack);
		} 
		var pack = new SocketPackage();
		pack.code = 100;
		pack.data = [socket.remotePort, socket.remoteAddress];
		//console.log('id:' + id);
		engine.sendBroadcast(pack, id);
	}

	function moveHandler(dataObj) {
		console.log('move to:' + dataObj.x +',' + dataObj.y); 
		
	}
	
	this.id = id;
	this.x = x;
	this.y = x;
	this.mapX = mapX;
	this.mapY = mapY;
	this.rotation = rotation;
	this.nat_port = nat_port;
	this.nat_address = nat_address;
	this.sendData = sendData;
	
}
module.exports = Client;

///编码数据
function codeData(vData) {
	if (vData == null) {
		return "";
	}
	//var resultList = [];
	//for (var key in vData) {
		//resultList.push(key + "=" + vData[key]);
	//}
	//return resultList.join("&");
	return vData.join(",");
}

///解码数据
function encodeData(str) {
	//var dataArr = str.split('&');
	//var resultData = {};
	//for (var i = 0; i < dataArr.length; i++) {
		//var keyVal = dataArr[i].split('=');
		//resultData[keyVal[0]] = keyVal[1];
	//}
	//return resultData;
	var dataList = str.split(",");
	return dataList;
}