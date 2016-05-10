var express = require('express');
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io')(server)

var routes = require('./app/routes.js')


server.listen(3000, function(){
    console.log('we in nigga at port 3000')
})

app.use(express.static('views')) // serv static content in views
app.use(routes) // use these routes
