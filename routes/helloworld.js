var express = require('express');
var router = express.Router();

router.get('/', function (req,res) {
    res.send('GET handler for the /helloworlf route');
});

router.post('/', function (req,res) {
    res.send('POST handler for the /helloworld route');
});