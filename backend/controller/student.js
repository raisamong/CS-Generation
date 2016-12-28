var libAuth = require('../lib/auth.js');
var libUtil = require('../lib/util.js');

global.router.route('/student/add')
    .post(function(req, res) {
        //setup search user
        var info = libAuth.escape(req.body);
        console.log(info);
        libUtil.select(['id'], 'students', ['id'], [info.code]).then(function(checkExist) {
            if (checkExist.result == 1) {
                libUtil.insert('students', [info.code, info.year, info.name,
                    info.surname, info.tel, info.facebook, info.address, info.cf
                ]).then(function() {
                    res.json({
                        result: 0
                    });
                }, function() {
                    res.json({
                        result: 3,
                        msg: 'Add student failed'
                    });
                });
            } else if (checkExist.result === 0) {
                res.json({
                    result: 1,
                    msg: 'This student already exists'
                });
            } else {
                console.log('check student error');
                res.json({
                    result: 3,
                    msg: 'Add student failed'
                });
            }
        }, function() {
            res.json({
                result: 2,
                msg: 'Connection Lost'
            });
        });
    });

global.router.route('/student/list')
    .post(function(req, res) {
        //setup search user
        var info = libAuth.escape(req.body);
        console.log(info);
        libUtil.select('*', 'students', ['year'], [info.year], req.body.limit).then(function(checkExist) {
            console.log(checkExist);
        });
    });

module.exports = router;
