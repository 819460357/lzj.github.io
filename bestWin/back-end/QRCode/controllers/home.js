var redis = require('../utils/redisUtils');
var mysql = require('../db/mysql').pool;
var md5 = require('md5');

module.exports = function (router) {
    router.post('/info', function(req, res) {
        getHomeInfo(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(err);
            })
    });
}

function getHomeInfo(data) {
    var mysqlConnect = null;
    return new Promise(function (resolve, reject) {
        if(!data['token'] || data['token'].trim() == '') {
            return reject({code: -1, msg: '请求不合法！'});
        }
        return resolve();
    })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                redis.checkToken(data['token'])
                    .then(function (result) {
                        if(!result.data) {
                            return reject({code: -1, msg: 'token过期，请重新登陆！'});
                        }
                        data['user_id'] = result['data'];
                        return resolve(result);
                    })
                    .catch(function (err) {
                        console.log(err);
                        return reject(err);
                    });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                mysql.getConnection(function (err, connect) {
                    if(err) {
                        return reject({code: -1, msg: '数据库连接失败！'});
                    }
                    mysqlConnect= connect;
                    mysqlConnect.beginTransaction(function (err) {
                        if(err) {
                            return reject({code: -1, msg: '数据库事务开启失败！'});
                        }
                        return resolve();
                    });
                })
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var selectSql =
                    "   SELECT COUNT(1) AS merch_num" +
                    "   FROM merch" +
                    "   WHERE effect = 1" +
                    "     AND active = 1";
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据获取失败！'});
                    }
                    return resolve({code: 0, data: result[0], msg: ''});
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var selectSql =
                    "   SELECT COUNT(1) AS qr_code_num" +
                    "   FROM qr_code" +
                    "   WHERE effect = 1" +
                    "     AND active = 1";
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据获取失败！'});
                    }
                    response['data'] = Object.assign(response['data'], result[0]);
                    return resolve(response);
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var selectSql =
                    "   SELECT COUNT(1) AS today_read_num" +
                    "   FROM qr_code" +
                    "   WHERE effect = 1" +
                    "     AND active = 1" +
                    "     AND modify_time > " + new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据获取失败！'});
                    }
                    response['data'] = Object.assign(response['data'], result[0]);
                    return resolve(response);
                });
            });
        })
        .then(function (result) {
            return new Promise(function (resolve, reject) {
                mysqlConnect.commit();
                return resolve(result);
            });
        })
        .catch(function (err) {
            console.log(err);
            return new Promise(function (resolve, reject) {
                if(mysqlConnect) mysqlConnect.rollback();
                return reject(err);
            });
        });
}
