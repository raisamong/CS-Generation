var express = require('express');
var app = express();
var _ = require('lodash');
var mysql = require('mysql');
var db = require('./db');
var bodyParser = require('body-parser');
var route = require('./api/route.js');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded body

var setupMysql = function () {
    var connection_object= new db();
    var connection = connection_object.connection;
    return connection;
};

var setupRoute = function () {
    _.forEach(route ,function(path) {
      var module = require(path);
      app.use('/', module);
    });
}

setupRoute();
global.connection = setupMysql();
global.mysql = mysql;
global._ = _;

module.exports = app;
