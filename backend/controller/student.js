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
        // res.json({
        //     result: 0
        // });
        // var field, value;
        // if (info.password) {
        //     field = ['username', 'password'];
        //     value = [info.username, info.password];
        // } else {
        //     field = ['username', 'access'];
        //     value = [info.username, req.body.access];
        // }
        // libUtil.select(['uid', 'access', 'pid'], 'users', field, value).then(function(user) {
        //     if (!user.result) {
        //         var pid = user.data[0].pid;
        //         libUtil.select('*', 'profiles', ['pid'], [pid]).then(function(profile) {
        //             if (!profile.result) {
        //                 var profileReturned = _.assign(profile.data[0], user.data[0]);
        //                 res.json({
        //                     result: 0,
        //                     data: profileReturned
        //                 });
        //             } else {
        //                 res.json({
        //                     result: 2,
        //                     msg: 'get profile failed'
        //                 });
        //             }
        //         }, function() {
        //             res.json({
        //                 result: 2,
        //                 msg: 'get profile failed'
        //             });
        //         });
        //     } else {
        //         res.json({
        //             result: 1,
        //             msg: 'get users failed'
        //         });
        //     }
        // }, function() {
        //     res.json({
        //         result: 3,
        //         msg: 'connection lost'
        //     });
        // });
    });

module.exports = router;
