var express = require('express')
var router = express.Router()

router.get('/', function(req, res){
    console.log('home')
    res.send('we in nigga')
})


module.exports = router;
