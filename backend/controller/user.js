var libAuth = require('../lib/auth.js');
var libUtil = require('../lib/util.js');

global.router.route('/login')
    .get(function(req, res) {
        res.send('Get a random book');
    })
    .post(function(req, res) {
        //setup search user
        var info = libAuth.escape(req.body);
        var inserts, sqlSeacrh, sqlDataReturn;
        sqlSeacrh = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?';
        inserts = ['users', 'username', info.username, 'password', info.password];
        sqlSeacrh = global.mysql.format(sqlSeacrh, inserts);

        //
        sqlDataReturn = 'SELECT * FROM ?? WHERE ?? = ?';
        inserts = ['profiles', 'pid'];
        //query
        global.connection.query(sqlSeacrh, function(err, rows, fields) {
            if(!err) {
                if (rows && rows.length) {
                    inserts.push(rows[0].pid);
                    sqlDataReturn = global.mysql.format(sqlDataReturn, inserts);
                    global.connection.query(sqlDataReturn, function(err, rowsData, fields) {
                        if(!err) {
                            res.json({
                                result: 0,
                                data: {
                                    access: rows[0].access,
                                    role: rows[0].role,
                                    profiles: rowsData[0]
                                }
                            });
                        }
                        else {
                            res.json({
                                result: 2,
                                msg: 'get profiles failed ' + err
                            });
                        }
                    });
                }
                else{
                    res.json({
                        result: 1,
                        msg: 'data not exist'
                    });
                }
            }
            else {
                res.json({
                    result: 2,
                    msg: 'login failed ' + err
                });
            }
        });
    })
    .put(function(req, res) {
        res.send('Update the book');
});

global.router.route('/register')
    .post(function (req, res) {
        if (req.body.code != 'pipenew') {
            res.json({
                result: 4,
                msg: 'wrong code'
            });
            return;
        }
        var info = libAuth.escape(req.body);
        libUtil.select('*', 'users',['username'],[info.username]).then(function (checkExist) {
            if (checkExist.result == 1) {
                res.json({
                    result: 10,
                });
            } else {
                res.json({
                    result: 1,
                    msg: 'check username failed' + checkExist
                });
            }
        });
        // var inserts, sqlCheck, sqlInsert, sqlInsert;
        // //setup info check username exist
        // sqlCheck = "SELECT * FROM ?? WHERE ?? = ?";
        // inserts = ['users', 'username', info.username];
        // sqlCheck = global.mysql.format(sqlCheck, inserts);
        //setup info insert

        // sqlInsert = "INSERT INTO ?? VALUES (null, ?, ?, ?, ?, ?, null)";
        // inserts = ['users', info.username, info.password, info.access, 1, 'admin'];
        // sqlInsert = global.mysql.format(sqlInsert, inserts);
        //query
        // global.connection.query(sqlCheck, function(err, rows, fields) {
        //     if (!err) {
        //         if (!(rows && rows.length)) {
        //             global.connection.query(sqlInsert, function(err, rows, fields) {
        //                 if (!err) {
        //                     res.json({
        //                         result: 0
        //                     });
        //                 }
        //                 else {
        //                     res.json({
        //                         result: 1,
        //                         msg: 'insert failed ' + err
        //                     });
        //                 }
        //             });
        //         }
        //         else{
        //             res.json({
        //                 result: 2,
        //                 msg: 'username exist'
        //             });
        //         }
        //     }
        //     else {
        //         res.json({
        //             result: 3,
        //             msg: 'check failed ' + err
        //         });
        //     }
        // });
});

module.exports = router;
