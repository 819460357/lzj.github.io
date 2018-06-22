var redis = require("redis");
var redisConfig = require('../config/redis').redis;

exports.saveToken = function(userId, token) {
    return new Promise(function (resolve, reject) {
        var redisClient = new redis.createClient(redisConfig.port, redisConfig.host, {});
        redisClient.on('error', function (error) {
           return reject({code: -1, msg: 'redis 连接错误！'});
        });

        var key = 'admin_' + token;

        redisClient.set(key, userId, function (err, reply) {
           if(err) {
               return reject({code: -1, msg: 'token 存储错误！'});
           }
           redisClient.expire(key, 2 * 24 * 60 * 60, function (err, reply) {
               if(err) {
                   return reject({code: -1, msg: 'token 存储错误！'});
               }
               return resolve({code: 0, msg: ''});
           })
        });
    });
}

exports.checkToken = function(token) {
    return new Promise(function (resolve, reject) {
        var redisClient = new redis.createClient(redisConfig.port, redisConfig.host, {});
        redisClient.on('error', function (error) {
            return reject({code: -1, msg: 'redis 连接错误！'});
        });

        var key = 'admin_' + token;

        redisClient.get(key, function (err, reply) {
            if(err) {
                return reject({code: -1, msg: '获取 token 错误！'});
            }
            return resolve({code: 0, data: reply});
        });
    });
}

exports.delToken = function(token) {
    return new Promise(function (resolve, reject) {
        var redisClient = new redis.createClient(redisConfig.port, redisConfig.host, {});
        redisClient.on('error', function (error) {
            return reject({code: -1, msg: 'redis 连接错误！'});
        });

        var key = 'admin_' + token;

        redisClient.del(key, function (err, reply) {
            if(err) {
                return reject({code: -1, msg: '系统错误！'});
            }
            return resolve({code: 0, msg: ''});
        });
    });
}
