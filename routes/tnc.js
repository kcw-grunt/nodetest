var express = require('express');
var router = express.Router();
var ax25 = require('th-d72-ax25');
var SerialPort = require('serialport');
var util = require('util');
var devicePath = '/dev/ttyUSB0'; 
console.log('Selected port: '+ devicePath +'\n');

const parsers = SerialPort.parsers;
// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
    delimiter: '\r\n'
  }); 

//Set port path regardless of OS

// const sp = SerialPort(devicePath,9600);


// sp.list(function (err, ports) {
//     ports.forEach(function(port) {
//       if (port.comName === '/dev/tty.SLAB_USBtoUART' || port.comName === '/dev/ttyUSB0') {
//         devicePath = port.comName;
//       }
//     });
// });
  
var tnc = new ax25.kissTNC(
    {	serialPort : devicePath,
      baudRate : 9600
    }
); 

var testpacket = new ax25.Packet(
	{	'sourceCallsign' : "KM6TIG",
		'sourceSSID' : 1,
		'destinationCallsign' : "KM6TIG",
		'destinationSSID' : 2,
		'type' : ax25.Defs.U_FRAME_UI,
		'infoString' : "Hello world!"
	}
); 
 
var beacon = function() {
	var frame = testpacket.assemble();
	tnc.send(frame);
	console.log("Beacon sent");
}
  
tnc.enterD72KISS();

tnc.startCONV('Hello');
 
tnc.on(
	"opened",
	function() {
		console.log("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate);
		setInterval(beacon, 20000);
	}
);

tnc.on(
	"frame",
	function(frame) {
		var packet = new ax25.Packet({ 'frame' : frame });
		console.log(
			util.format(
				"Packet seen from %s-%s to %s-%s.",
				packet.sourceCallsign,
				packet.sourceSSID,
				packet.destinationCallsign,
				packet.destinationSSID
			)
		);
		if(packet.infoString != "")
			console.log(packet.infoString);
	}
);



router.get('/', function (req,res) {
    //res.send('GET handler for the /tnc route');

});

router.post('/', function (req,res) {
    //res.send('POST handler for the /tnc route');
});

router.get('/sender/:senderCallsign/destination/:destCallsign', function (req,res) {

    //This sends a JSON  res.send(req.params) 
});

router.get('/sender/:senderCallsign/destination/:destCallsign/message/:messageText', function (req,res) {
     
});



router.get('/func/', function (req,res){

    // let fun = req.query.funcId; 
    // switch (fun) {
    //     case '1':
    //     res.send('First is best');
    //     case '2':
    //     res.send('Second is ok');
    //     default:
    //     res.send('DEFAULT');
    // }
});

module.exports = router;