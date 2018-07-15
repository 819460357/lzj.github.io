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

    router.post('/edit', function(req, res) {
        editMerch(req.body)
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
        // if(!data['title'] || data['title'].trim() == '') {
        //     return reject({code: -1, msg: '请填写防伪标题！'});
        // }
        // if(!data['addr'] || data['addr'].trim() == '') {
        //     return reject({code: -1, msg: '请填写商户地址！'});
        // }
        // if(!data['tel'] || data['tel'].trim() == '') {
        //     return reject({code: -1, msg: '请填写商户客户热线！'});
        // }
        // if(!data['wechat'] || data['wechat'].trim() == '') {
        //     return reject({code: -1, msg: '请填写商户微信号！'});
        // }
        // if(!data['qrCode'] || data['qrCode'].trim() == '') {
        //     return reject({code: -1, msg: '请填写商户微信二维码！'});
        // }
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
                    "     , `support_tag` = " + data['support_tag'] +
                    "     , effect = 1" +
                    "     , active = 1";
                if(data['title'] && data['title'].trim() != '') {
                    insertSql += "     , `title` = '" + data['title'] + "'";
                }
                if(data['addr'] && data['addr'].trim() != '') {
                    insertSql += "     , `addr` = '" + data['addr'] + "'";
                }
                if(data['tel'] && data['tel'].trim() != '') {
                    insertSql += "     , `tel` = '" + data['tel'] + "'";
                }
                if(data['wechat'] && data['wechat'].trim() != '') {
                    insertSql += "     , `wechat` = '" + data['wechat'] + "'";
                }
                if(data['qr_code'] && data['qr_code'].trim() != '') {
                    insertSql += "     , `qr_code` = '" + data['qrCode'] + "'";
                }
                if(data['fixed_line'] && data['fixed_line'].trim() != '') {
                    insertSql += "     , `fixed_line` = '" + data['fixed_line'] + "'";
                }

                mysqlConnect.query(insertSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    return resolve({code: 0, data: {id: result.insertId}});
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                if(!(Object.hasOwnProperty.call(data, 'imgs') && data.imgs.length > 0)) return resolve(response);
                var insertSqlArr = new Array();
                for(var i = 0; i < data.imgs.length; i ++) {
                    var insertSql =
                        "   INSERT INTO merch_img" +
                        "   SET append_user_id =  "+ data['user_id'] +
                        "     , `merch_id` = " + response['data']['id'] +
                        "     , `url` = '" + data.imgs[i] + "'" +
                        "     , effect = 1" +
                        "     , active = 1";
                    insertSqlArr.push(insertSql);
                }
                mysqlConnect.query(insertSqlArr.join(';'), function (err, result) {
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
                    return resolve({code: 0, data:{ list: result}});
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
                    "        , merch.fixed_line" +
                    "        , merch.support_tag" +
                    "        , merch.wechat" +
                    "        , merch.code_num AS total" +
                    "        , merch.addr" +
                    "        , merch.qr_code" +
                    "        , merch.tel" +
                    // "        , merch.title" +
                    "        , merch.wechat" +
                    "   FROM merch" +
                    "   LEFT JOIN qr_code ON qr_code.merch_id = merch.id" +
                    "         AND qr_code.effect = 1" +
                    "         AND qr_code.active = 1" +
                    "   WHERE merch.effect = 1" +
                    "     AND merch.active = 1" +
                    "     AND merch.id = " + data['id'] +
                    "   LIMIT 1";
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
                var selectSql =
                    "   SELECT url" +
                    "   FROM merch_img" +
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

function editMerch(data) {
    var mysqlConnect = null;
    return new Promise(function (resolve, reject) {
        if(!data['token'] || data['token'].trim() == '') {
            return reject({code: -1, msg: '请求不合法！'});
        }
        if(data['id'] <= 0) {
            return reject({code: -1, msg: '系统错误！'});
        }
        if(!data['name'] || data['name'].trim() == '') {
            return reject({code: -1, msg: '请填写商户名称！'});
        }
        // if(!data['title'] || data['title'].trim() == '') {
        //     return reject({code: -1, msg: '请填写防伪标题！'});
        // }
        // if(!data['addr'] || data['addr'].trim() == '') {
        //     return reject({code: -1, msg: '请填写商户地址！'});
        // }
        // if(!data['tel'] || data['tel'].trim() == '') {
        //     return reject({code: -1, msg: '请填写商户客户热线！'});
        // }
        // if(!data['wechat'] || data['wechat'].trim() == '') {
        //     return reject({code: -1, msg: '请填写商户微信号！'});
        // }
        // if(!data['qrCode'] || data['qrCode'].trim() == '') {
        //     return reject({code: -1, msg: '请填写商户微信二维码！'});
        // }
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
                        return resolve({code: 0, data: {}});
                    });
                })
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var updateSql =
                    "   UPDATE merch" +
                    "   SET modify_user_id =  "+ data['user_id'] +
                    "     , `name` = '" + data['name'] + "'" +
                    "     , `support_tag` = " + data['support_tag'] +
                    // "     , `title` = '" + data['title'] + "'" +
                    "     , `addr` = '" + data['addr'] + "'" +
                    "     , `tel` = '" + data['tel'] + "'" +
                    "     , `wechat` = '" + (data['wechat'] ? data['wechat'] : '') + "'" +
                    "     , `qr_code` = '" + (data['qrCode'] ? data['qrCode'] : '') + "'" +
                    "     , `fixed_line` = '" + (data['fixed_line'] ? data['fixed_line'] : '') + "'" +
                    "     , effect = 1" +
                    "     , active = 1" +
                    "   WHERE id = " + data['id'];

                mysqlConnect.query(updateSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    return resolve({code: 0, msg: '', data: {}});
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var selectSql =
                    "   SELECT url" +
                    "   FROM merch_img" +
                    "   WHERE merch_id = " + data['id'] +
                    "     AND effect = 1" +
                    "     AND active = 1";
                mysqlConnect.query(selectSql, function (err, result) {
                    if(err) {
                        return reject({code: -1, msg: '数据获取失败！'});
                    }
                    var imgs= new Array();
                    for(var i = 0; i < result.length; i++) {
                        imgs.push(result[i]['url']);
                    }
                    response.data['imgs'] = imgs;
                    return resolve(response);
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                var oldImgs = JSON.parse(JSON.stringify(response['data']['imgs']));
                var newImgs = JSON.parse(JSON.stringify(data['imgs']));
                if(newImgs.length == 0) {
                    data['delImgs'] = oldImgs;
                    return resolve(response);
                }
                for (var i = newImgs.length - 1; i >= 0; i--) {
                    if(oldImgs.indexOf(newImgs[i]) >= 0) {
                        data['imgs'].splice(i, 1);
                    }
                }
                data['delImgs'] = new Array();
                for (var i = oldImgs.length -1; i >= 0; i--) {
                    if(newImgs.indexOf(oldImgs[i]) < 0) {
                        data['delImgs'].push(oldImgs[i]);
                    }
                }
                return resolve(response);
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                if(!(Object.hasOwnProperty.call(data, 'imgs') && data.imgs.length > 0)) return resolve(response);
                var insertSqlArr = new Array();
                for(var i = 0; i < data.imgs.length; i ++) {
                    var insertSql =
                        "   INSERT INTO merch_img" +
                        "   SET append_user_id =  "+ data['user_id'] +
                        "     , `merch_id` = " + data['id'] +
                        "     , `url` = '" + data.imgs[i] + "'" +
                        "     , effect = 1" +
                        "     , active = 1";
                    insertSqlArr.push(insertSql);
                }
                mysqlConnect.query(insertSqlArr.join(';'), function (err, result) {
                    if(err) {
                        console.log(err);
                        return reject({code: -1, msg: '数据存储失败！'});
                    }
                    return resolve(response);
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                if(!(Object.hasOwnProperty.call(data, 'delImgs') && data.delImgs.length > 0)) return resolve(response);
                var updateSqlArr = new Array();
                for(var i = 0; i < data.delImgs.length; i ++) {
                    var updateSql =
                        "   update merch_img" +
                        "   SET modify_user_id =  "+ data['user_id'] +
                        "     , effect = 0" +
                        "     , active = 0" +
                        "   WHERE `merch_id` = " + data['id'] +
                        "     AND effect = 1" +
                        "     AND active = 1" +
                        "     AND `url` = '" + data.delImgs[i] + "'";
                    updateSqlArr.push(updateSql);
                }
                console.log(updateSqlArr.join(';'));
                mysqlConnect.query(updateSqlArr.join(';'), function (err, result) {
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
                return resolve({code: 0, data: {}, msg: ''});
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
