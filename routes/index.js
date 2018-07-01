var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Onda Terminal Node' });
});

// router.get('/tnc', function(req, res, next) {
//   res.render('tnc', { title: 'Onda Terminal Node' });
// });
 
  
module.exports = router;
