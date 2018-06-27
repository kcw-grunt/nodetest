var express = require('express');
var router = express.Router();
var ax25 = require('th-d72-ax25');

var messageString = '';
console.log('Turn Kenwood THD72A On  and set to Packet 12 \n Pressing TNC');

var tnc = new ax25.kissTNC(
    {	serialPort : "/dev/ttyUSB0",
      baudRate : 9600
    }
);

console.log('TNC set...');

// function send_string(str) {

//     const packet = new ax25.Packet();
//     packet.type = ax25.Defs.U_FRAME_UI;
//     packet.sourceCallsign = 'KM6TIG';
//     packet.sourceSSID = 1;
//     packet.destinationCallsign = 'KM6TIG';
//     packet.destinationSSID = 2;
//     packet.infoString == 'HELLO Stupid test string';
//     tnc.send(packet.assemble(), () => console.log('Sent:', str));
// }



router.get('/', function (req,res) {
    //res.send('GET handler for the /tnc route');
    messageString = 'Send test packet';
    send_string(messageString); 
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


 




module.exports = router;

