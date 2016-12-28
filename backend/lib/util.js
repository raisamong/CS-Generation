var _ = require('lodash');
var promise = require('bluebird');

var select = function(selected, table, where, conditions, limit) {
    return new promise.Promise(function(resolve, reject) {
        var sql = 'SELECT ';
        var inserts = [table];

        if (!table) {
            reject();
            return;
        }

        if (!selected) {
            selected = "*";
        }

        if (selected == '*') {
            sql += '* FROM ' + '??';
        } else {
            _.forEach(selected, function(field, key) {
                sql += field + ',';
            });
            sql = sql.substring(0, sql.length - 1);
            sql += ' FROM ' + '??';
        }

        if (where.length == conditions.length) {
            sql += ' WHERE ';
            _.forEach(where, function(field, key) {
                sql += '?? = ? AND ';
                inserts.push(field, conditions[key]);
            });
            sql = sql.substring(0, sql.length - 4);
        }

        if (limit) {
            if (Array.isArray(limit)){
                sql += 'LIMIT ' + limit[0] + ',' + limit[1];
            } else {
                sql += 'LIMIT ' + limit;
            }
        }

        sql = global.mysql.format(sql, inserts);
        console.log(sql);
        global.connection.query(sql, function(err, rows, fields) {
            if (!err) {
                if (rows && rows.length) {
                    resolve({
                        result: 0,
                        data: rows
                    });
                } else {
                    resolve({
                        result: 1,
                        msg: 'data not exist'
                    });
                }
            } else {
                reject();
            }
        });
    });
};

var insert = function(table, values) {
    return new promise.Promise(function(resolve, reject) {
        var sql = "INSERT INTO ?? VALUES (";
        var inserts = [table];

        _.forEach(values, function(value, key) {
            if (value === null) {
                sql += 'null, ';
            } else {
                sql += '?, ';
                inserts.push(value);
            }
        });
        sql = sql.substring(0, sql.length - 2) + ')';
        console.log(sql, inserts);
        sql = global.mysql.format(sql, inserts);
        global.connection.query(sql, function(err, rows) {
            if (!err) {
                resolve(rows.insertId);
            } else {
                console.log(err);
                reject();
            }
        });
    });
};

module.exports = {
    select: select,
    insert: insert
};
