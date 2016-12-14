var app = require('./app');

app.set('port', process.env.PORT || 8000);
app.set('ipaddress', process.env.IPADDR || '127.0.0.1');

var server = app.listen(app.get('port'), app.get('ipaddress'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
