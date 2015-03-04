/**
 * Created by hn on 2015/3/3.
 */
'use strict';

module.exports.CONFIG = {
    'host': '127.0.0.1',
    'port': 9527,
    'assets': './assets/',
    'data': './data/',
    'app': './app/',
    'controller': './app/controllers/',
    'model': './app/models/',
    'view': './app/views/',
    'lib': './app/libs/',
    'file_expiry_time': 0, // HTTP cache expiry time, minutes
    'directory_listing': true
};

module.exports.MIME_TYPES = {
    'txt': 'text/plain',
    'md': 'text/plain',
    'html': 'text/html',
    'htm': 'text/plain',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'zip': 'text/plain',
    'cfg': 'text/plain'
};
