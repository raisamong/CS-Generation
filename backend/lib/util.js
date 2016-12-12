var _ = require('lodash');
var promise = require('bluebird');

var select = function (selected, table, where, conditions) {
    return new promise.Promise(function (resolve, reject) {
        var sql = 'SELECT ';
        var inserts = [table];
        if (!table) reject();
        if (!selected) selected = "*"

        if (selected == '*') {
            sql += '* FROM ' + '??';
        } else {
            _.forEach(selected, function (field, key) {
                sql += field + ',';
            });
            sql = sql.substring(0, sql.length - 1);
            sql += ' FROM ' + '??';
        }

        if (where.length == conditions.length) {
            sql += ' WHERE ';
            _.forEach(where, function (field, key) {
                sql += '?? = ? AND ';
                inserts.push(field, conditions[key]);
            });
            sql = sql.substring(0, sql.length - 4);
        }

        sql = global.mysql.format(sql, inserts);
        console.log(sql);
        global.connection.query(sql, function(err, rows, fields) {
            if(!err) {
                if (rows && rows.length) {
                    resolve({
                        result: 0,
                        data: rows
                    });
                }
                else{
                    resolve({
                        result: 1,
                        msg: 'data not exist'
                    });
                }
            }
            else {
                reject({
                    result: 2,
                    msg: 'select data err' + err
                });
            }
        });
    });
};

module.exports = {
    select: select
};
