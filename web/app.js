var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');
var request = require('request');

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
    console.log(info);
    fs.readFile(file.path, function (err, fileData) {
        request({
            method: 'POST',
            uri: info.path,
            headers: {
                "Content-type": "multipart/form-data",
                "X-CS-Access": info.access
            },
            multipart: [{
                'Content-Disposition': 'form-data; name="' + info.type + '";filename="' + file.originalname + '"',
                'Content-Type': file.mimetype,
                body: fileData
            }]
        }, function (error, response, body) {
            fs.unlink(file.path);
            console.log(body);
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                res.json({
                    result: 0,
                    url: body.url
                });
            } else {
                res.json({
                    result: 1,
                    err: error
                });
            }
        });
    });
});

module.exports = app;
