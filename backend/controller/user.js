var libAuth = require('../lib/auth.js');
var libUtil = require('../lib/util.js');

global.router.route('/login')
    .post(function(req, res) {
        //setup search user
        var info = libAuth.escape(req.body);
        var field, value;
        if (info.password) {
            field = ['username', 'password'];
            value = [info.username, info.password];
        } else {
            field = ['username', 'access'];
            value = [info.username, req.body.access];
        }
        libUtil.select(['uid', 'access', 'pid'], 'users', field, value).then(function(user) {
            if (!user.result) {
                var pid = user.data[0].pid;
                libUtil.select('*', 'profiles', ['pid'], [pid]).then(function(profile) {
                    if (!profile.result) {
                        var profileReturned = _.assign(profile.data[0], user.data[0]);
                        res.json({
                            result: 0,
                            data: profileReturned
                        });
                    } else {
                        res.json({
                            result: 2,
                            msg: 'get profile failed'
                        });
                    }
                }, function() {
                    res.json({
                        result: 2,
                        msg: 'get profile failed'
                    });
                });
            } else {
                res.json({
                    result: 1,
                    msg: 'get users failed'
                });
            }
        }, function() {
            res.json({
                result: 3,
                msg: 'connection lost'
            });
        });
    });

global.router.route('/register')
    .post(function(req, res) {
        var role = req.body.role || 'user';
        if (role == 'admin') {
            if (req.body.code != 'pipenew') {
                res.json({
                    result: 5,
                    msg: 'wrong code'
                });
                return;
            }
        }
        var info = libAuth.escape(req.body);
        libUtil.select('*', 'users', ['username'], [info.username]).then(function(checkExist) {
            if (checkExist.result == 1) {
                libUtil.insert('profiles', [null, req.body.username, '', '', '']).then(function(pid) {
                    libUtil.insert('users', [null, info.username, info.password, info.access, pid, role, null]).then(function() {
                        res.json({
                            result: 0,
                        });
                    }, function() {
                        res.json({
                            result: 3,
                            msg: 'insert users failed'
                        });
                    });
                }, function() {
                    res.json({
                        result: 2,
                        msg: 'insert profile failed'
                    });
                });
            } else {
                res.json({
                    result: 1,
                    msg: 'check username failed' + checkExist
                });
            }
        }, function() {
            res.json({
                result: 4,
                msg: 'database error' + checkExist
            });
        });
    });

module.exports = router;
