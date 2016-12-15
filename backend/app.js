var express = require('express');
var app = express();
var router = express.Router();
var _ = require('lodash');
var mysql = require('mysql');
var db = require('./db');
var bodyParser = require('body-parser');
var route = require('./api/route.js');

global._ = _;
global.router = router;

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
    // console.log(req.headers);
    // Pass to next layer of middleware
    next();
});

var setupMysql = function() {
    var connection_object = new db();
    var connection = connection_object.connection;
    return connection;
};

var setupRoute = function() {
    _.forEach(route, function(path) {
        var module = require(path);
        app.use('/', module);
    });
};
setupRoute();

global.connection = setupMysql();
global.mysql = mysql;

module.exports = app;
