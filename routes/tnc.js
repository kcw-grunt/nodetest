var express = require('express');
var router = express.Router();
var ax25 = require('th-d72-ax25');
var port = require('serialport');
var messageString = '';
console.log('Turn Kenwood THD72A on and set to Packet 12 \nPressing TNC');

var tnc = new ax25.kissTNC(
    {	serialPort : "/dev/tty.SLAB_USBtoUART",
      baudRate : 9600
    }
);
  
 
///dev/ttyUSB0
console.log('TNC set...');

function send_string(str) {


    var packet = new ax25.Packet(
        {	'destinationCallsign'	: "KM6TIG",
            'destinationSSID'		: 1,
            'sourceCallsign'		: "KM6TIGE",
            'sourceSSID'			: 2,
            'pollFinal'				: true,
            'command'				: true,
            'type'					: ax25.Defs.U_FRAME_UI,
            'nr'					: 1,
            'ns'					: 3,
            'pid'					: ax25.Defs.PID_NONE,
            'infoString'			: "Your mother."
        }
    );
    console.log(packet);
 

    // packet.type = ax25.Defs.U_FRAME_UI;
    // packet.sourceCallsign = 'KM6TIG';
    // packet.sourceSSID = 1;
    // packet.destinationCallsign = 'KM6TIG';
    // packet.destinationSSID = 2;
    // packet.infoString == 'HELLO Stupid test string';
    tnc.send(packet.assemble(), () => console.log('Sent:', str));
}

router.get('/', function (req,res) {
    //res.send('GET handler for the /tnc route');
    messageString = 'Send test packet';
    send_string(messageString); 

    tnc.on(
        "frame",
        function(frame) {
            console.log("Here's an array of bytes representing an AX.25 frame: " + frame);
        }
    );
    
    tnc.on(
        "error",
        function(err) {
            console.log("HURRRRR! I DONE BORKED!" + err);
        }
    );
    res.send({ response: 'Sent:'+ messageString }); 
});

router.post('/', function (req,res) {
    res.send('POST handler for the /tnc route');
});

router.get('/sender/:senderCallsign/destination/:destCallsign', function (req,res) {

    //This sends a JSON  res.send(req.params) 
});

router.get('/sender/:senderCallsign/destination/:destCallsign/message/:messageText', function (req,res) {
    res.send(req.params)
});

router.get('/echotest/kiss', function (req,res, next) {
    console.log('Set the echo test')
    next()
}, function (req, res) {
    res.send('KISS started')
});

router.get('/func/', function (req,res){

    let fun = req.query.funcId; 
    switch (fun) {
        case '1':
        res.send('First is best')
        case '2':
        res.send('Second is ok')
        default:
        res.send('DEFAULT')
    }
});

module.exports = router;

