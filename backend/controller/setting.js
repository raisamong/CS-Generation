var libAuth = require('../lib/auth.js');
var libUtil = require('../lib/util.js');

global.router.route('/setting/register')
    .get(function(req, res) {
        libUtil.select(['passcode'], 'code' , 'name', 'register').then(function (OriginCode) {
            console.log('OriginCode', OriginCode.data[0].passcode);
            if (OriginCode.data[0].passcode) {
                res.json({
                    result: 0,
                    data: OriginCode.data[0].passcode
                });
            } else {
              res.json({
                  result: 1,
                  msg: 'get Code failed'
              });
            }
        }, function () {
            res.json({
                result: 1,
                msg: 'Connection Lost'
            });
        });
    });

module.exports = router;
