var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
var request = require('request');
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'ddh0udtsk',
  api_key: '229892396977635',
  api_secret: 'd5Lf3el5eXtGbfGjGatMgYohsqs'
});

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

app.post('/upload',function(req,res){
    var file = req.files[0];
    var info = req.body.otherInfo;
    cloudinary.uploader.upload(file.path, function(url) {
        fs.unlink(file.path);
        console.log('aaaaaaaaaaa', url);
        res.json({
            result: 0,
            data: url
        });
    });
});

module.exports = app;
