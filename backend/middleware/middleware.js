var promise = require('bluebird');
var libUtil = require('../lib/util.js');

var checkAccess = function (access) {
    return new promise.Promise(function (resolve, reject) {
        libUtil.select(['access'], 'users', ['access'], [access]).then(function (data) {
            if (data.result === 0) {
                resolve();
            } else {
                reject({
                    result: 2,
                    msg: "No Permission"
                });
            }
        }, function () {
            reject({
                result: 2,
                msg: "No Permission"
            });
        });
    });
};

module.exports = {
    checkAccess: checkAccess
};
