var redis = require('../utils/redisUtils');
var mysql = require('../db/mysql').pool;
var md5 = require('md5');

module.exports = function (router) {
    router.post('/add', function(req, res) {
        addMerch(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    router.post('/list', function (req, res) {
        getMerchList(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {

                res.json(err);
            })
    });

    router.post('/info', function (req, res) {
        getMerchInfo(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {

                res.json(err);
            })
    });

}


function addMerch(data) {
    var mysqlConnect = null;
    return new Promise(function (resolve, reject) {
        if(!data['token'] || data['token'].trim() == '') {
            return reject({code: -1, msg: '请求不合法！'});
        }
        if(!data['name'] || data['name'].trim() == '') {
            return reject({code: -1, msg: '请填写商户名称！'});
        }
        if(!data['title'] || data['title'].trim() == '') {
            return reject({code: -1, msg: '请填写防伪标题！'});
        }
        if(!data['addr'] || data['addr'].trim() == '') {
            return reject({code: -1, msg: '请填写商户地址！'});
        }
        if(!data['tel'] || data['tel'].trim() == '') {
            return reject({code: -1, msg: '请填写商户客户热线！'});
        }
        if(!data['wechat'] || data['wechat'].trim() == '') {
            return reject({code: -1, msg: '请填写商户微信号！'});
        }
        if(!data['qrCode'] || data['qrCode'].trim() == '') {
            return reject({code: -1, msg: '请填写商户微信二维码！'});
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
                var insertSql =
                    "   INSERT INTO merch" +
                    "   SET append_user_id =  "+ data['user_id'] +
                    "     , `name` = '" + data['name'] + "'" +
                    "     , `title` = '" + data['title'] + "'" +
                    "     , `addr` = '" + data['addr'] + "'" +
                    "     , `tel` = '" + data['tel'] + "'" +
                    "     , `wechat` = '" + data['wechat'] + "'" +
                    "     , `qr_code` = '" + data['qrCode'] + "'" +
                    "     , effect = 1" +
                    "     , active = 1";

                mysqlConnect.query(insertSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    return resolve({code: 0, data: {id: result.insertId}});
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

function getMerchList(data) {
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
                var selectSql =
                    "   SELECT * FROM `merch`" +
                    "   WHERE effect = 1" +
                    "     AND active = 1";

                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    return resolve({code: 0, list: result});
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                mysqlConnect.commit();
                return resolve(response);
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

function getMerchInfo(data) {
    var mysqlConnect = null;
    return new Promise(function (resolve, reject) {
        if(!data['token'] || data['token'].trim() == '') {
            return reject({code: -1, msg: '请求不合法！'});
        }
        if(!data['id'] || data['id'].trim() == '') {
            return reject({code: -1, msg: '请选择商户！'});
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
                var selectSql =
                    "   SELECT merch.`name`" +
                    "        , merch.id" +
                    "        , COUNT(qr_code.id) AS num" +
                    "   FROM merch" +
                    "   LEFT JOIN qr_code ON qr_code.merch_id = merch.id" +
                    "         AND qr_code.effect = 1" +
                    "         AND qr_code.active = 1" +
                    "   WHERE merch.effect = 1" +
                    "     AND merch.active = 1" +
                    "     AND merch.id = " + data['id'] +
                    "   LIMIT 1";
                console.log(selectSql);
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    if(result.length == 0) {
                        return resolve({code: -1, msg: '商户不存在！'});
                    }
                    return resolve({code: 0, data: result[0]});

                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                mysqlConnect.commit();
                return resolve(response);
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
