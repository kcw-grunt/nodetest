var express = require('express');
var router = express.Router();
var ax25 = require('th-d72-ax25');
var SerialPort = require('serialport');
var util = require('util');
var messageString = '';
console.log('Turn Kenwood THD72A on and set to Packet 12 \nPressing TNC');

var devicePath = '/dev/ttyUSB0'; 
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
 

console.log('Selected port: '+ devicePath +'\n');

 
var tnc = new ax25.kissTNC(
    {	serialPort : devicePath,
      baudRate : 9600
    }
);
   
console.log('TNC set...');

//port.on('open', showPortOpen);
var beacon = function() {
	var packet = new ax25.Packet(
		{	sourceCallsign : "KM6TIG",
			sourceSSID : 1,
			destinationCallsign : "VEX0",
			destinationSSID : 2,
			type : ax25.Defs.U_FRAME_UI,
			infoString : "Hello world!"
		}
	);
	var frame = packet.assemble();
	tnc.send(frame);
	console.log("Beacon sent");
}
 

tnc.enterD72KISS();

tnc.on(
	"opened",
	function() {
		console.log("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate);
		setInterval(beacon, 30000);
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