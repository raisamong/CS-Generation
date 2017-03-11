var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(multer({dest:__dirname+'/file/uploads/'}).any());
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/resources', express.static(__dirname + '/resources'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded body

app.get('/', function(req, res) {
    res.sendFile('resources/views/index.html', {
        root: __dirname
    });
});


module.exports = app;
