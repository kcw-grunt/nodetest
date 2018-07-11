var express = require('express');
var router = express.Router();
var ax25 = require('th-d72-ax25');
var util = require('util');

const delay = ms => {
	return new Promise((resolve) => {
		setTimeout(resolve,ms);
	});
};

const Delimiter = require('@serialport/parser-delimiter')
const parser = port.pipe(new Delimiter({ delimiter: '\n' }))
parser.on('data', console.log)

var devicePath = '/dev/KENWOOD_TH-D72A';
// var osvar = process.platform;
// console.log(osvar);
// if (osvar == 'darwin') {
// 	console.log("Using Mac OS");
//     devicePath = '/dev/tty.SLAB_USBtoUART';
// }else{ 
// 	devicePath = '/dev/ttyUSB0';
// }

var radiodata ="--NO RESPONSE--";
var messageContent = ""; 


var tnc = new ax25.kissTNC(
	{	serialPort : devicePath,
		baudRate : 9600
	}
);

setupTHD72A();

const setupTHD72A = async () => {
	if (tnc) {
		tnc.sendRAWPacket('KISS ON');
		await delay(2000);
		tnc.sendRAWPacket('RESTART');
		await delay(4000);
	}
}
function updateLogText(str) {
	radiodata = str; 
	//.res.render('tnc', {remote_response:radiodata+"\n"+Date.now()}); //, remote_response:ct 
}


function sendTestMessage(scs,sssid,dcs,dssid,message_tx,callback) { 
	console.log(scs + sssid + "\n"+ dcs+ dssid +"\n"+ message_tx+ "\n" );
	var ssid_s = parseInt(sssid, 10);
	var ssid_d = parseInt(dssid, 10);
	scs= ""+scs;
	dcs = ""+dcs;
	message_tx = ""+message_tx;
	messageContent = message_tx;

	var testpacket = new ax25.Packet(
		{	'sourceCallsign' : scs,
			'sourceSSID' : ssid_s,
			'destinationCallsign' : dcs,
			'destinationSSID' : ssid_d,
			'type' : ax25.Defs.U_FRAME_UI,
			'infoString' : message_tx
		}
	);
    currentPacket = testpacket; 
	var frame = testpacket.assemble();
	tnc.send(frame);
	console.log('Test message sent:'+ frame);
	radiodata = 'Test message sent' + frame; 
	callback();
}  
 
tnc.on(
	"opened",
	function() {
		console.log("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate); 
		updateLogText("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate);
		//setInterval(beacon, 20000);
	}
);

tnc.on(
	"closed",
	function() {
		console.log("TNC closed on " + tnc.serialPort ); 
		updateLogText("TNC closed on " + tnc.serialPort ); 
	}
);

tnc.on(
	"written to port",
	function() {
		console.log(tnc.serialPort + "TNC written to " ); 
		updateLogText(tnc.serialPort + "TNC written to " );  
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
			radiodata = packet.infoString;
	}
);

tnc.on(
	"sent",
	function() {
		console.log(tnc.serialPort + "TNC sent " ); 
		updateLogText(tnc.serialPort + "TNC sent " );  
	}
);

tnc.on(
	"data",
	function(data) {
		console.log('Data:',data );; 
	}
)

// myPort.on('open', showPortOpen);    // called when the serial port opens
// myPort.on('close', showPortClose);  // called when the serial port closes
// myPort.on('error', showError);   // called when there's an error with the serial port
parser.on('data', readSerialData); 

function readSerialData(data) {
	console.log(data);
  }
//tnc.parser.on('data', console.log);
 
router.get('/', function (req,res) {    
	res.render('tnc', { title: 'TNC Messaging', message_tx:messageContent, remote_response:radiodata+"\n"+Date.now()});
});
 
router.post('/', function (req,res) {
    //res.send('POST handler for the /tnc route');
});

router.post('/sendmessage', function (req,res) {
	var sourceid = req.body.ssids
	var sourcecallsign = ""+req.body.srccs
	var destcallsign = ""+req.body.destcs
	var destssid = req.body.ssidd
	var messagetext = ""+req.body.message

	if ( sourceid.length > 0 && destssid.length > 0 && sourcecallsign.length > 0 && destcallsign.length > 0 && messagetext.length > 0) {
		console.log('Beacon Ping');	
		updateLogText('Beacoon Ping');
		sendTestMessage(sourcecallsign,sourceid,destcallsign,destssid,messagetext, function() {
			res.render('tnc', { title: 'TNC Messaging', message_tx:messageContent, remote_response:radiodata+"\n"+Date.now()});
		});
	} else {
		console.log('STM Failed');
		updateLogText('STM Failed');
		res.render('tnc', { title: 'TNC Messaging', message_tx:messageContent, remote_response:radiodata+"\n"+Date.now()});
	} 
  });

  router.post('/cmd', function (req,res) {
	  var cmd = req.body.d72cmd;
	  console.log('in cmd: '+cmd);
	tnc.sendRAWPacket(''+cmd);
//('E ON HBAUD 9600 M ON PASSALL ON KISS ON RESTART');
  });


  //////Error Housekeeping
  process.on('unhandledRejection', (reason, promise) => {
	console.log('PROCESS : Unhandled Rejection at:', reason.stack || reason)
  })

module.exports = router;
 
'use strict';
var express = require('express');
var router = express.Router(); 
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
//const Readline = SerialPort.parsers.Readline;  
var devicePath = '/dev/KENWOOD_TH-D72A';
var dataLine = [];
// var osvar = process.platform;
// console.log(osvar);
// if (osvar == 'darwin') {
// 	console.log("Using Mac OS");
//     devicePath = '/dev/tty.SLAB_USBtoUART';
// }else{ 
// 	devicePath = '/dev/ttyUSB2';
// }
    


 
port.write('KISS ON\r\n', function(err) {
  console.log('KISS ON Turned on');
});

port.write('RESTART\r\n', function(err) {
  console.log('Restarted');
});

port.on('data', function(data) {

  // if(data =='0D 0A') {
  //   console.log('Date line:'+ dataline)
  // } else {
  //   dataLine.push(data);
  // }
  console.log('Data:', data);
});

port.on('open', function() {
  console.log('Port Opened');
});

port.on('closed', function() {
  console.log('Port Closed');
});

var start = Date.now();
setInterval(function() {
    var delta = Date.now() - start; // milliseconds elapsed since start
     // alternatively just show wall clock time:
    console.log(new Date().toUTCString());
    port.write('I\r\n');
    port.write('Hi Mom!');
    port.write(new Buffer('Hi Mom!'));
}, 5000); // update 