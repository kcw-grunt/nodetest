var express = require('express');
var router = express.Router();


router.get('/sendmessage', function (req,res) { 
    console.log('form info');
});
module.exports = router;