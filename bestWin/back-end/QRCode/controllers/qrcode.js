var redis = require('../utils/redisUtils');
var mysql = require('../db/mysql').pool;
var md5 = require('md5');

module.exports = function (router) {
    router.post('/add', function(req, res) {
        addQrcode(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(err);
            })

    });
}

function addQrcode(data) {
    var mysqlConnect = null;
    return new Promise(function (resolve, reject) {
        if(!data['token'] || data['token'].trim() == '') {
            return reject({code: -1, msg: '请求不合法！'});
        }
        if(!data['merch_id'] || data['merch_id'].trim() == '') {
            return reject({code: -1, msg: '系统错误！'});
        }
        if(!data['num'] || data['num'].trim() == '') {
            return reject({code: -1, msg: '请填写生成数量！'});
        }
        if(!data['begin_code'] || data['begin_code'].trim() == '') {
            return reject({code: -1, msg: '系统错误！'});
        }
        return resolve();
    })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                redis.checkToken(data['token'])
                    .then(function (result) {
                        if(!result.data) {
                            return reject({code: -1, msg: '请求不合法！'});
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
                var insertSqlArr = new Array();
                for(var i = 1; i <= data.num; i ++ ) {
                    var insertSql =
                        "   INSERT INTO qr_code" +
                        "   SET append_user_id =  "+ data['user_id'] +
                        "     , `merch_id` = '" + data['merch_id'] + "'" +
                        "     , effect = 1" +
                        "     , active = 1"  +
                        "     , code = " +  (parseInt(data.begin_code) + i);
                    if(Object.hasOwnProperty.call(data, 'from') && data.form.trim() != '') {
                        insertSql += "  ,  `from` = '" + data.form.trim() + "'";
                    }
                    if(Object.hasOwnProperty.call(data, 'to') && data.to.trim() != '') {
                        insertSql += "  ,  `to` = '" + data.to.trim() + "'";
                    }
                    if(Object.hasOwnProperty.call(data, 'desc') && data.desc.trim() != '') {
                        insertSql += "  ,  `desc` = '" + data.desc.trim() + "'";
                    }
                    insertSqlArr.push(insertSql);
                }

                mysqlConnect.query(insertSqlArr.join('; '), function (err, result) {
                    console.log(result);
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    return resolve({code: 0, data: {}});
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
