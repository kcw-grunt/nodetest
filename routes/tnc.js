'use strict';
var express = require('express');
var router = express.Router();
var ax25 = require('th-d72-ax25');
var util = require('util');
var dataLine = [];
var devicePath = '/dev/KENWOOD_TH-D72A';

var radiodata ="--NO RESPONSE--";
var messageContent = ""; 


var tnc = new ax25.kissTNC(
	{	serialPort : devicePath,
		baudRate : 9600
	}
);
 
setupTHD72A();

function setupTHD72A() {
	if (tnc) {
		tnc.sendRAWString('KISS ON');
		    setTimeout(function() {
			  tnc.sendRAWString('RESTART');
		}, 4000);
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
		console.log(tnc.serialPort + "data sent " ); 
		updateLogText(tnc.serialPort + "data sent " );  
	}
);

tnc.on(
	"data",
	function(data) {
		if(data == '\r\n') {
			console.log('Data line:' + dataLine);
		} else {
			dataLine.push(data);
		}
 	}
)
 
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

  //////Error Housekeeping
  process.on('unhandledRejection', (reason, promise) => {
	console.log('PROCESS : Unhandled Rejection at:', reason.stack || reason)
  })

module.exports = router;
 