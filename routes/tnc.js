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
 
 
// var beacon = function() {
// 	var frame = testpacket.assemble();
// 	tnc.send(frame);
// 	console.log("Beacon sent");
// }

function sendTestMessage(scs,sssid,dcs,dssid,message_tx) {

	console.log('inside send test message');
	console.log(scs + sssid + "\n"+ dcs+ dssid +"\n"+ message_tx+ "\n" );
	var ssid_s = parseInt(sssid, 10);
	var ssid_d = parseInt(dssid, 10);
	scs= ""+scs;
	dcs = ""+dcs;
	message_tx = ""+message_tx;

	console.log('ssds:'+ ssid_s + 'ssdd' + ssid_d);
	var testpacket = new ax25.Packet(
		{	'sourceCallsign' : scs,
			'sourceSSID' : ssid_s,
			'destinationCallsign' : dcs,
			'destinationSSID' : ssid_d,
			'type' : ax25.Defs.U_FRAME_UI,
			'infoString' : message_tx
		}
	);
	//console.log(testpacket);
	var frame = testpacket.assemble();
	tnc.send(frame);
	console.log('Test message sent');
}
  
tnc.enterD72KISS();

//tnc.startCONV('Hello');
 
tnc.on(
	"opened",
	function() {
		console.log("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate);
		//setInterval(beacon, 20000);
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
	res.render('tnc', { title: 'TNC Page' });
});
 
router.post('/', function (req,res) {
    //res.send('POST handler for the /tnc route');
});

router.post('/sendmessage', function (req,res) {
	console.log('inside post');
	var sourceid = req.body.ssids
	var sourcecallsign = ""+req.body.srccs
	var destcallsign = ""+req.body.destcs
	var destssid = req.body.ssidd
	var messagetext = ""+req.body.message 

	console.log("Message = "+messagetext+"\nSource Callsign = "+sourcecallsign+" Source SSID = "+sourceid+"\nDest Callsign = "+destcallsign+" Dest SSID = "+destssid);
	
	if (typeof sourceid == 'number' && typeof destssid == 'number' && typeof sourcecallsign == 'string' && typeof destcallsign == 'string' && typeof messagetext == 'string') {
		sendTestMessage(sourcecallsign,sourceid,destcallsign,destssid,messagetext);
	} else {
		console.log('stm Failed');
		res.redirect('back');
	}
	//res.render('tnc', {remote_response: 'TEST Message'});

	//console.log({source_callsign:sourcecallsign,source_id:sourceid,dest_callsign:destcallsign,dest_ssid:destssid,message_tx:messagetext});
	// console.log(ms);
	//res.send('POST for message');
	//res.redirect('/tnc');
  });

// router.get('/func/', function (req,res){

//     // let fun = req.query.funcId; 
//     // switch (fun) {
//     //     case '1':
//     //     res.send('First is best');
//     //     case '2':
//     //     res.send('Second is ok');
//     //     default:
//     //     res.send('DEFAULT');
//     // }
// });

module.exports = router;

function newFunction() {
	return 'Express';
}
