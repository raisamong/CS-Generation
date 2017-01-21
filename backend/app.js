var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();
var _ = require('lodash');
var mysql = require('mysql');
var db = require('./db');
var multer = require('multer');
var bodyParser = require('body-parser');
var route = require('./api/route.js');
var middleware = require('./middleware/middleware');
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'ddh0udtsk',
  api_key: '229892396977635',
  api_secret: 'd5Lf3el5eXtGbfGjGatMgYohsqs'
});

global._ = _;
global.router = router;

app.use(multer({dest:__dirname+'/file/uploads/'}).any());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded body
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,X-CS-Access');
    res.contentType('application/json');
    console.log('ying');
    // console.log(req.headers);
    // Pass to next layer of middleware
    next();
});

var setupMiddleware = function () {
    app.use('/student', function (req, res, next) {
        console.log('Request URL:', req.originalUrl);
        var access = req.headers['x-cs-access'];
        middleware.checkAccess(access).then(function () {
            next();
        }, function (err) {
            res.json(err);
        });
    });
};

var setupMysql = function() {
    var connection_object = new db();
    var connection = connection_object.connection;
    return connection;
};

var setupRoute = function() {
    setupMiddleware();
    _.forEach(route, function(path) {
        var module = require(path);
        app.use('/', module);
    });
};
setupRoute();
global.connection = setupMysql();
global.mysql = mysql;

app.post('/upload',function(req,res){
    var file = req.files[0];
    var info = req.body.otherInfo;
    cloudinary.uploader.upload(file.path, function(url) {
        fs.unlink(file.path);
        res.json({
            result: 0,
            data: url
        });
    });
});

module.exports = app;
