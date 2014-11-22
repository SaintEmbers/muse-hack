var io = require('socket.io-client');
var dgram = require("dgram");
var osc = require('osc-min');

var server = dgram.createSocket("udp4");
var socket = io('http://104.131.10.60:8080');
// var socket = io('http://localhost:8080');


var oscObj;

var message_counter = 0;
var batch = [];

server.on("message", function(msg, rinfo) {
  var error;
  try {
    oscObj = osc.fromBuffer(msg);
    oscObj['timeInMs'] = Date.now();

    batch.push(oscObj);
    // socket.emit('oscdata', oscObj);

    message_counter += 1;

		if(message_counter % 2000 == 0) {
      console.log('Recieved 2k messages ' + message_counter / 2000);
      socket.emit('oscbatch', batch);
      console.log(batch);
      batch = [];
		}


  } catch (_error) {
    error = _error;
    socket.emit('err', "invalid OSC packet");
  }
});

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " +
      address.address + ":" + address.port);
});


server.bind(5001);
// server listening 0.0.0.0:5001
