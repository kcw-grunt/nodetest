var express = require('express');
var router = express.Router();

router.get('/', function (req,res) { 
	res.render('terminal', { title: 'Terminal Page' });
});

// /* GET Hello World page. */
// router.get('/terminal', function(req, res) {
//     //res.render('terminal', { title: 'Hello, Terminal' });
//     res.send('GET Handler for the /terminal endppint');
// });
      
// router.post('/terminal', function(req, res) {
//     //res.render('terminal', { title: 'Hello, Terminal' });
//     res.send('POST Handler for the /terminal endppint');
// });
router.get('/sendmessage', function (req,res) { 
    console.log('form info');
});
module.exports = router;