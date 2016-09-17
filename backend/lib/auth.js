var crypto = require('crypto');

var pwHash = function(passwd, enc) {
    var hash = crypto.createHash('sha1');
    return !!passwd ? hash.update(passwd).digest(enc ? enc : 'hex') : passwd;
};

var genAccess = function (id) {
    var access = id + Date.now();
    return pwHash(access);
}

var escape = function(data) {
    var info = {};
    var temp;
    _.forEach(data ,function(value, key) {
        if (key == 'password' || key == 'username') {
            temp = pwHash(value);
            info[key] = global.connection.escape(temp);
        }
        else if (key == 'access'){
            temp = genAccess(value);
            info[key] = global.connection.escape(temp);
        }
        else{
            info[key] = global.connection.escape(value);
        }
    });
    return info;
};

module.exports.pwHash = pwHash;
module.exports.escape = escape;
