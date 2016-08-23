var express = require('express');
var app = express();
var _ = require('lodash');
var mysql = require('mysql');
var db = require('./db.js');
var bodyParser = require('body-parser');
// var route = require('./controller/route.js');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded body
app.use('/bower_components', express.static(__dirname + '/bower_components'));
// app.use('/localize', express.static(__dirname + '/localize'));
app.use('/resources', express.static(__dirname + '/resources'));

app.get('/', function (req, res) {
    res.sendFile('resources/html/index.html', { root: __dirname });
});
app.get('/new', function (req, res) {
    res.sendFile('resources/html/new.html', { root: __dirname });
});

var setupMysql = function () {
    var connection_object= new db();
    var connection = connection_object.connection;
    return connection;
};

// var setupRoute = function () {
//     _.forEach(route ,function(path) {
//       var module = require(path);
//       app.use('/', module);
//     });
// }

// setupRoute();
global.connection = setupMysql();
global.mysql = mysql;
global._ = _;

module.exports = app;
