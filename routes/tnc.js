var express = require('express');
var router = express.Router();
var ax25 = require('th-d72-ax25');
var SerialPort = require('serialport'); 
var util = require('util');

var devicePath = '/dev/ttyUSB0'; 
var radiodata ="--NO RESPONSE--";
var messageContent = "";
var currentPacket = new ax25.Packet();

var tnc = new ax25.kissTNC(
    {		serialPort : devicePath,
	  		baudRate : 9600,
	  		txDelay	 : 30,
			persistence	: 63,
			slotTime		: 10,
			fullDuplex: false
    }
); 

console.log('Selected port: '+ devicePath +'\n');

var beacon = function(scs,sssid,dcs,dssid,message_tx) {
	var ssid_s = parseInt(sssid, 10);
	var ssid_d = parseInt(dssid, 10);
	scs= ""+scs;
	dcs = ""+dcs;
	message_tx = ""+message_tx;
	var packet = new ax25.Packet(
		{	'sourceCallsign' : scs,
			'sourceSSID' : ssid_s,
			'destinationCallsign' : dcs,
			'destinationSSID' : ssid_d,
			'type' : ax25.Defs.U_FRAME_UI,
			'infoString' : message_tx
		}
	);
	var frame = packet.assemble();
	tnc.send(frame);
	console.log("Beacon sent.");
}

function updateLogText(str) {
	radiodata = str; 
	//.res.render('tnc', {remote_response:radiodata+"\n"+Date.now()}); //, remote_response:ct 
}

function sendTestMessage(scs,sssid,dcs,dssid,message_tx) { 
	console.log(scs + sssid + "\n"+ dcs+ dssid +"\n"+ message_tx+ "\n" );
	var ssid_s = parseInt(sssid, 10);
	var ssid_d = parseInt(dssid, 10);
	scs= ""+scs;
	dcs = ""+dcs;
	message_tx = ""+message_tx;
	messageContent = message_tx;

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
    currentPacket = testpacket; 
	var frame = testpacket.assemble();
	tnc.send(frame);
	console.log('Test message sent');
	radiodata = 'Test message sent'; 
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
 

router.get('/', function (req,res) {    
	res.render('tnc', { title: 'TNC Messaging', message_tx:messageContent, remote_response:radiodata+"\n"+Date.now()});
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

	console.log("Message = "+messagetext+"\nSource Callsign = "+sourcecallsign+" "+sourceid+"\nDest Callsign = "+destcallsign+" "+destssid+"\n");
	
	if ( sourceid.length > 0 && destssid.length > 0 && sourcecallsign.length > 0 && destcallsign.length > 0 && messagetext.length > 0) {
		console.log(' Beacon Ping');	
		updateLogText('Beacoon Ping');
		sendTestMessage(sourcecallsign,sourceid,destcallsign,destssid,messagetext);
	} else {
		console.log('STM Failed');
		updateLogText('STM Failed');
	 } 
	res.render('tnc', { title: 'TNC Messaging', message_tx:messageContent, remote_response:radiodata+"\n"+Date.now()});
  });

module.exports = router;
 
