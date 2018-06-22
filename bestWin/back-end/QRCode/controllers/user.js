var redis = require('../utils/redisUtils');
var mysql = require('../db/mysql').pool;
var md5 = require('md5');

module.exports = function (router) {
    router.post('/login', function(req, res) {
       login(req.body['userName'], req.body['password'])
           .then(function (result) {
               res.json(result);
           })
           .catch(function (err) {
               res.json(err);
           });
    });

    router.post('/validate', function(req, res) {
        validate(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    router.post('/logout', function(req, res) {
        logout(req.body)
            .then(function (result) {
                res.json(result);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}

function login(userName, password) {
    var mysqlConnect = null;
    return new Promise(function (resolve, reject) {
        if(!userName || userName.trim() == '') {
            return reject({code: -1, msg: '请输入账号！'});
        }
        if(!password || userName.trim() == '') {
            return reject({code: -1, msg: '请输入密码！'});
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
                    "   SELECT `user`.`id` AS user_id" +
                    "        , `user`.user_name AS user_name" +
                    "        , `user`.name AS name " +
                    "        , `user`.append_time AS append_time " +
                    "        , `admin`.`id`  AS admin_id" +
                    "   FROM `user`" +
                    "   LEFT JOIN `admin` ON `admin`.user_id = `user`.id" +
                    "   WHERE `user_name` = '" + userName + "' AND `password` = '" + password + "'" +
                    "   LIMIT 1";

                mysqlConnect.query(selectSql, function (err, result) {
                   if(err) {
                       return reject({code: -1, msg: '数据库查询出错！'});
                   }
                   if(result.length == 0) {
                       return reject({code: -1, msg: '账号或密码错误！'});
                   }
                   return resolve({code: 0, data: {user: result[0]}});
                });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
             var chars = [
                 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
             ]
                var token = chars[Math.floor(Math.random() * 62 -1)] + chars[Math.floor(Math.random() * 62 -1)] + chars[Math.floor(Math.random() * 62 -1)] + chars[Math.floor(Math.random() * 62 -1)] +chars[Math.floor(Math.random() * 62 -1)] +chars[Math.floor(Math.random() * 62 -1)]
                            + chars[Math.floor(Math.random() * 62 -1)] + chars[Math.floor(Math.random() * 62 -1)] + chars[Math.floor(Math.random() * 62 -1)] +chars[Math.floor(Math.random() * 62 -1)];
                token = md5(token);

                redis
                    .saveToken(response['data']['user']['user_id'], token)
                    .then(function (result) {
                        return resolve({code: 0, data: Object.assign(response['data']['user'],{token: token}) })
                    })
                    .catch(function (err) {
                        return reject(err);
                    })
            });
        })
        .then(function (result) {
            return new Promise(function (resolve, reject) {
                mysqlConnect.commit();
                return resolve(result);
            });
        })
        .catch(function (err) {
            return new Promise(function (resolve, reject) {
                if(mysqlConnect) mysqlConnect.rollback();
               return reject(err);
            });
        });
}

function validate(data) {
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
                            return resolve({code: 0, data:{alive: false}});
                        }
                        return resolve({code: 0, data:{alive: true}});
                    })
                    .catch(function (err) {
                        console.log(err);
                        return reject(err);
                    });
            });
        })
        .catch(function (err) {
            console.log(err);
            return new Promise(function (resolve, reject) {
                return reject(err);
            });
        });
}

function logout(data) {
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
                            return resolve({code: 0, data:{alive: false}});
                        }
                        return resolve({code: 0, data:{alive: true}});
                    })
                    .catch(function (err) {
                        console.log(err);
                        return reject(err);
                    });
            });
        })
        .then(function (response) {
            return new Promise(function (resolve, reject) {
                redis.delToken(data['token'])
                    .then(function (result) {
                        return resolve({code: 0, msg: ''});
                    })
                    .catch(function (err) {
                        console.log(err);
                        return reject(err);
                    });
            });
        })
        .catch(function (err) {
            console.log(err);
            return new Promise(function (resolve, reject) {
                return reject(err);
            });
        });
}