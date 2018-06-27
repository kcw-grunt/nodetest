var express = require('express');
var router = express.Router();

/* GET Hello World page. */
router.get('/terminal', function(req, res) {
    //res.render('terminal', { title: 'Hello, Terminal' });
    res.send('GET Handler for the /terminal endppint');
});
      
router.post('/terminal', function(req, res) {
    //res.render('terminal', { title: 'Hello, Terminal' });
    res.send('POST Handler for the /terminal endppint');
});

module.exports = router;