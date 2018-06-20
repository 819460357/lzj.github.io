var mysql = require('mysql');
var config = require('../config/mysql').mysql;

exports.pool  = mysql.createPool({
    connectionLimit    : config.connectionLimit,
    host                 : config.host,
    user                 : config.user,
    password            : config.password,
    database            : config.database,
    multipleStatements : true
});
