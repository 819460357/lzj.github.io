var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');

var DIRNAME = __dirname + '/../public/images/';

module.exports = function (router) {

  router.post('/uploadImg', function (req, res) {
    uploadImg(req)
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        res.json(err);
      })
  });

}

function uploadImg (req) {
  return new Promise(function (resolve, reject) {
    var form = new multiparty.Form({ uploadDir: DIRNAME });
    form.parse(req, function (err, fields, files) {
      if (err) {
        return reject({ code: -1, msg: '文件上传出错' })
      }
      if (Object.keys(files).length == 0) {
        return reject({ code: -1, msg: '请选择要上传的文件！' })
      }
      var urls = new Array();
      var promiseResult = new Array();
      for (key in files) {
        var fileName = DIRNAME + new Date().getTime() + '_' + Math.floor(Math.random() * 100) + files[key][0]['originalFilename'].substring(files[key][0]['originalFilename'].lastIndexOf('.'));
        urls.push(fileName.substring(fileName.indexOf('/public') + 7));
        promiseResult.push(renameImg(files[key][0]['path'], fileName));
      }
      Promise
        .all(promiseResult)
        .then(function (result) {
          console.log(result);
          return resolve({ code: 0, data: { urls: urls } });
        })
        .catch(function (err) {
          console.log('err', err);
          return reject({ code: -1, msg: '文件重命名失败！' });
        });
    });
  });
}


function renameImg (oldPath, newPath) {
  return new Promise(function (resolve, reject) {
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        console.log(err);
        return reject({ code: -1, msg: '文件上传出错' })
      }
      fs.exists(newPath, function (exists) {
        console.log(exists);
        if (exists) {
          return resolve({ code: 0 });
        } else {
          return reject({ code: -1, msg: '文件重命名失败！' });
        }
      });
    });
  })

}
