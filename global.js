/**
 * Created by hn on 2015/3/3.
 */
global.db_config = require('./app/config/database.config.js');
global.app = require('./app/config/app.config.js');
global.CONFIG = app.CONFIG;
global.MIME_TYPES = app.MIME_TYPES;
global.EXPIRY_TIME = (CONFIG.file_expiry_time * 60).toString();

global.url = require("url");               //解析GET请求
global.query = require("querystring");     //解析POST请求
global.fs = require('fs');                 // 文件操作
global.mongoose = require('mongoose');     //mongoDB接口

var Crypto = require('crypto');
global.getEtag = function (data){
    var hash = Crypto.createHash( 'md5' );
    hash.update( data );
    return hash.digest( 'hex' );
};

global.parseRange = function(str, size) {
    if (str.indexOf(",") != -1) {
        return;
    }
    str = str.replace("bytes=", "");
    var range = str.split("-"),
        start = parseInt(range[0], 10),
        end = parseInt(range[1], 10);
    // Case: -100
    if (isNaN(start)) {
        start = size - end;
        end = size - 1;
        // Case: 100-
    } else if (isNaN(end)) {
        end = size - 1;
    }
    // Invalid
    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }
    return {
        start: start,
        end: end
    };
};


global.res_part = function(request, response, path){
    var range = common.parseRange(request.headers["range"], fileFullSize);
    if (range) {
        var raw = fs.createReadStream(path, {
            "start": range.start,
            "end": range.end
        });
        headers['Content-Length'] = range.end - range.start + 1;
        headers['Content-Range'] = "bytes " + range.start + "-" + range.end + "/" + fileFullSize;
        headers['ETag'] = etag;
        response.writeHead(200, headers);
        raw.pipe(response);
        response.end(raw);
    } else {
        console.log("range format error");
        // range格式错误
        response.removeHeader("Content-Length");
        response.writeHead(416, "Request Range Not Satisfiable");
        response.end();
    }

}

global.execController = function(name,callback){
    var controller_path = CONFIG.controller + name +'.controller.js';
    fs.exists(controller_path,function(exists){

        if(exists){
            callback(require(controller_path));
        }else{
            callback(false);
        }
    })

}

global.execModel = function(name,callback){
    var model_path = CONFIG.model + name +'.model.js';
    fs.exists(model_path,function(exists){

        if(exists){
            callback(require(model_path));
        }else{
            callback(false);
        }
    })
}
