var express = require('express');
var router = express.Router();

router.get('/', function (req,res) {
    res.send('GET handler for the /tnc route');
});

router.post('/', function (req,res) {
    res.send('POST handler for the /tnc route');
});

module.exports = router;

