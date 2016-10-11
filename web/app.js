var express = require('express');
var app = express();

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/resources', express.static(__dirname + '/resources'));

app.get('/', function (req, res) {
    res.sendFile('resources/views/index.html', { root: __dirname });
});

module.exports = app;
