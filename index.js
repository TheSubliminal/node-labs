'use strict';

const http = require('http');
const https = require('https');

const server = http.createServer((request, response) => {


    console.log('URLS: ', request.url);

    response.setHeader('Testing', 'This is my Proxy! ');

    if (request.url.split('://')[0] === 'http') {
        http.get(request.url, (resp) => {

            resp.pipe(response);

        }).on('error', err => {
            console.log('Error from get: ', err.message);
        });
    }
    else {
        https.get(request.url, (resp) => {

            resp.pipe(response);

        }).on('error', err => {
            console.log('Error from get: ', err.message);
        });
    }

});

server.listen(8000);

