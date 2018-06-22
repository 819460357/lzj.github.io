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

    router.post('/info', function(req, res) {
        getCodeInfo(req.body, req.headers)
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
        if(!data['merch_id'] || parseInt(data['merch_id']) < 0) {
            return reject({code: -1, msg: '系统错误！'});
        }
        if(!Object.hasOwnProperty.call(data, 'num') || data['num'] == 0) {
            return reject({code: -1, msg: '请填写生成数量！'});
        }
        if(!Object.hasOwnProperty.call(data, 'num') || parseInt(data['begin_code']) < 0) {
            return reject({code: -1, msg: '系统错误！'});
        }
        console.log(3);
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
                for(var i = 1; i <= parseInt(data.num); i ++ ) {
                    var insertSql =
                        "   INSERT INTO qr_code" +
                        "   SET append_user_id =  "+ data['user_id'] +
                        "     , `merch_id` = '" + data['merch_id'] + "'" +
                        "     , effect = 1" +
                        "     , active = 1"  +
                        "     , code = " +  (parseInt(data.begin_code) + i);
                    if(Object.hasOwnProperty.call(data, 'from') && data.from.trim() != '') {
                        insertSql += "  ,  `from` = '" + data.from.trim() + "'";
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


function getCodeInfo(data, headers) {
    var mysqlConnect = null;
    return new Promise(function (resolve, reject) {
        if(!data['merch_id'] || parseInt(data['merch_id']) < 0) {
            return reject({code: -1, msg: '请求链接不合法！'});
        }
        if(!Object.hasOwnProperty.call(data, 'code') || data['code'] == 0) {
            return reject({code: 0, data: {unExist: true}});
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
                    "   SELECT qr_code.`code`" +
                    "        , qr_code.`read`" +
                    "        , qr_code.first_read_time" +
                    "        , qr_code.`from`" +
                    "        , qr_code.`to`" +
                    "        , qr_code.`desc`" +
                    "        , qr_code.device_type" +
                    "        , merch.`name`" +
                    "        , merch.title" +
                    "        , merch.addr" +
                    "        , merch.qr_code" +
                    "        , merch.tel" +
                    "        , merch.wechat" +
                    "   FROM qr_code" +
                    "   LEFT JOIN merch ON merch.id = qr_code.merch_id" +
                    "   WHERE qr_code.effect = 1" +
                    "     AND qr_code.active = 1" +
                    "     AND qr_code.merch_id = " + data['merch_id'] +
                    "     AND qr_code.`code` = " + data ['code'];
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    if(result.length == 0) {
                        return reject({code: 0, data: {unExist: true}});
                    }
                    var body = result[0];
                    var antifakeCode = md5(body['code']);

                    body['antifakeCode'] = antifakeCode;
                    return resolve({code: 0, data: body});
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                if(!response['data']['unExist']) return resolve(response);
                var selectSql =
                    "   SELECT merch.`name`" +
                    "        , merch.title" +
                    "        , merch.addr" +
                    "        , merch.qr_code" +
                    "        , merch.tel" +
                    "        , merch.wechat" +
                    "   FROM merch" +
                    "   WHERE merch.effect = 1" +
                    "     AND merch.active = 1" +
                    "     AND merch.merch_id = " + data['merch_id'];
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    if(result.length == 0) {
                        return reject({code: 0, data: {unExist: true}});
                    }
                    var body = result[0];
                    body['unExist'] = true;
                    return resolve({code: 0, data: body});
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var selectSql =
                    "   SELECT url" +
                    "   FROM merch_img" +
                    "   WHERE merch_id = " + data['merch_id'] +
                    "     AND effect = 1" +
                    "     AND active = 1";
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据获取失败！'});
                    }
                    if(result.length == 0) {
                        return reject({code: 0, data: {unExist: false}});
                    }
                    response.data['imgs'] = result;
                    return resolve(response);
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var updateSql =
                    "   UPDATE qr_code" +
                    "   SET `read` = " + (parseInt(response['data']['read']) + 1) +
                    "      , first_read_time = " + (response['data']['first_read_time'] ? response['data']['first_read_time'] : new Date().getTime()/1000) +
                    "      , `device_type` = '" + (response['data']['device_type'] ? response['data']['device_type'] : headers['user-agent'].toString()) + "'" +
                    "   WHERE merch_id = " +  data['merch_id'] +
                    "     AND `code` = " + data['code'];
                mysqlConnect.query(updateSql, function (err, result) {
                    if(err) {
                        console.log(err, updateSql);
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
