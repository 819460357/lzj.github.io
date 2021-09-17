var redis = require('../utils/redisUtils');
var mysql = require('../db/mysql').pool;
var md5 = require('md5');

module.exports = function (router) {
    router.get('/', function(req, res) {
        getCodeInfo(req.query, req.headers)
            .then(function (result) {
                result.data = JSON.stringify(result.data);
                return res.render('index', result);
            })
            .catch(function (err) {
                // res.json(err);
                return res.render('index', err);
            })
    });
}

function getCodeInfo(data, headers) {
    var mysqlConnect = null;
    return new Promise(function (resolve, reject) {
        // if(!data['merch_id'] || parseInt(data['merch_id']) < 0) {
        if(!data['id'] || parseInt(data['id']) < 0) {
            return reject({code: -1, msg: '请求链接不合法！'});
        }
        if(!Object.hasOwnProperty.call(data, 'code') || data['code'] == 0) {
            return reject({code: 0, data: {unExist: true}});
        }
        if(data['id'] == 91 && (data['code'] >= 110002 && data['code'] <= 330002 )) {
            data['id'] = 90;
        }
        if(data['id'] == 91 && (data['code'] >= 330002 && data['code'] <= 440002 )) {
            data['id'] = 90;
        }
        return resolve();
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
                    "   SELECT merch.`name`" +
                    // "        , merch.title" +
                    "        , merch.addr" +
                    "        , merch.support_tag" +
                    "        , merch.fixed_line" +
                    "        , merch.qr_code" +
                    "        , merch.wc_img" +
                    "        , merch.official_website" +
                    "        , merch.tel" +
                    "        , merch.wechat" +
                    "        , IF(merch.id > 0, TRUE, FALSE) AS merch_exist" +
                    "        ,IF(qr_code_range.id > 0, TRUE,FALSE) AS code_exist" +
                    "        , IF(qr_code_range.effect = 1, " + data ['code'] + "," + data ['code'] + ") AS code" +
                    // "        , qr_code_range.`read`" +
                    // "        , qr_code_range.first_read_time" +
                    "        , qr_code_range.`from`" +
                    "        , qr_code_range.`to`" +
                    "        , qr_code_range.`brand_name`" +
                    "        , qr_code_range.`desc`" +
                    "        , merch.`wechat_uin`" +
                    "   FROM merch" +
                    "   LEFT JOIN qr_code_range ON merch.id = qr_code_range.merch_id" +
                    "     AND qr_code_range.`start` <= " + data ['code'] +
                    "     AND qr_code_range.`end` >= " + data ['code'] +
                    "     AND qr_code_range.effect = 1" +
                    "     AND qr_code_range.active = 1" +
                    "   WHERE merch.effect = 1" +
                    "     AND merch.active = 1" +
                    // "     AND merch.id = " + data['merch_id'];
                    "     AND merch.id = " + data['id'];
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据获取失败！'});
                    }
                    if(result.length == 0) {
                        return reject({code: 0, data: {merch_exist: false}});
                    }
                    var body = result[0];
                    if(body.code_exist) {
                        var antifakeCode = md5(body['code']);
                        body['antifakeCode'] = antifakeCode;
                    }
                    return resolve({code: 0, data: body});
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var selectSql =
                    "   SELECT url" +
                    "   FROM merch_img" +
                    // "   WHERE merch_id = " + data['merch_id'] +
                    "   WHERE merch_id = " + data['id'] +
                    "     AND effect = 1" +
                    "     AND active = 1";
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据获取失败！'});
                    }
                    response.data['imgs'] = result;
                    return resolve(response);
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var selectSql =
                    "   SELECT `read`" +
                    "        , `first_read_time`" +
                    "        , `device_type`" +
                    "        ,  `id` AS qrcode_id" +
                    "   FROM qr_code" +
                    // "   WHERE merch_id = " +  data['merch_id'] +
                    "   WHERE merch_id = " + data['id'] +
                    "     AND `code` = " + data['code'] +
                    "     AND effect = 1" +
                    "     AND active = 1" +
                    "   LIMIT 1";
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据获取失败！'});
                    }
                    if(result.length == 1) {
                        response.data.read = result[0]['read'];
                        response.data.first_read_time = result[0]['first_read_time'];
                        response.data.device_type = result[0]['device_type'];
                        response.data.qrcode_id = result[0]['qrcode_id'];
                    } else {
                        response.data.read = 0;
                        response.data.first_read_time = '';
                        response.data.device_type = '';
                    }
                    return resolve(response);
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                if(!response.data.code_exist) return resolve(response);
                var sql = ''
                if(response['data']['read'] == 0) {
                    sql =
                        "   INSERT INTO qr_code" +
                        "   SET `read` = 1"  +
                        "      , first_read_time = " +  new Date().getTime()/1000 +
                        "      , `device_type` = '" +  headers['user-agent'].toString() + "'" +
                        // "      , merch_id = " +  data['merch_id'] +
                        "      , merch_id = " +  data['id'] +
                        "      , `code` = " + data['code'] +
                        "      , effect = 1" +
                        "      , active = 1";
                } else {
                    sql =
                        "   UPDATE qr_code" +
                        "   SET `read` = " + (parseInt(response['data']['read']) + 1) +
                        "      , first_read_time = " + (response['data']['first_read_time'] ? response['data']['first_read_time'] : new Date().getTime()/1000) +
                        "      , `device_type` = '" + (response['data']['device_type'] ? response['data']['device_type'] : headers['user-agent'].toString()) + "'" +
                        // "   WHERE merch_id = " +  data['merch_id'] +
                        "   WHERE merch_id = " +  data['id'] +
                        "     AND `code` = " + data['code'] +
                        "     AND `id` = " + response['data']['qrcode_id'];
                }
                mysqlConnect.query(sql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
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
