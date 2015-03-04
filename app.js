/**
 * Created by hn on 2015/3/3.
 */
'use strict';

require('./global.js');

var http = require('http');
var path = require('path');


// Start server
http.createServer(function(request, response) {

    var headers = {
        'Accept-Ranges': 'bytes',
        'Content-Type': 'text/plain',
        'Cache-Control': 'max-age=' + EXPIRY_TIME
    };
    var realPath = '.'+ request.url;

    fs.exists(realPath, function(exists){
        if(exists){
            // 静态资源服务
            fs.readFile(realPath,'utf-8',function(err,data){
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'unknown';
                var contentType = MIME_TYPES[ext] || "text/plain";
                headers["Content-Type"] = contentType;
                var etag = getEtag(data);
                if (request.headers.hasOwnProperty('if-none-match') && request.headers['if-none-match'] === etag) {
                    response.writeHead(304,  "Not Modified");
                    response.end();
                }else {
                    var raw = fs.createReadStream(realPath);
                    response.writeHead(200, "Ok");
                    raw.pipe(response);
                }
            });
        }else{
            // 动态资源服务
            var router = request.url.split('/');
            router = router.filter(function(item){
                return item != ''
            })

            var controller_name = router[0];
            var action_name = router[1];

            execController(controller_name,function(controller) {

                if(controller === false) {
                    response.writeHead(404);
                    response.write('controller err: your url is not right!');
                    response.end();
                }
                var action = controller[action_name];
                //console.log(controller);
                if (typeof action != 'function') {
                    response.writeHead(404);
                    response.write('action err: your url is not right!');
                    response.end();
                }
                else {
                    action(request, response, function (data, type) {
                        headers['Content-Type'] = MIME_TYPES[type];

                        // 无内容
                        if (!data || data.length <= 0) {
                            response.writeHead(404);
                            response.end();
                        }

                        //  Not Modified
                        var etag = getEtag(data);
                        if (request.headers.hasOwnProperty('if-none-match') && request.headers['if-none-match'] === etag) {
                            response.writeHead(304, "Not Modified");
                            response.end();
                        }

                        // 更新
                        var fileFullSize = data.length;
                        if (request.headers["range"]) {
                            // 如果有range
                            res_part(request, response, data);  // 该 data 自然为 路径了
                        } else {
                            // 没有range，全返回
                            headers['Content-Length'] = data.length;
                            headers['ETag'] = etag;
                            response.writeHead(200, headers);
                            response.end(data);
                        }
                    })
                }
             });
        }
    });
}).listen( CONFIG.port, CONFIG.host );

console.log( 'node Online : http://' + CONFIG.host + ':' + CONFIG.port.toString() + '/' );

