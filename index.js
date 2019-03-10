'use strict';

//const http = require('http');
//const https = require('https');
//const fs = require('fs');
const url = require('url');

//let content = fs.readFileSync('index.html');


require('http').createServer((request, response) => {

    // console.log(request.url);
    console.log(request.url, url.parse(request.url).protocol);

    //if (request.url.split(':')[0] === 'http') {
    require('http').get(request.url, (resp) => {

            resp.pipe(response);

        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    //}

    /*if (request.url.split(':')[0] === 'https') {
        https.get('https://' + request.url.split('://')[1], resp => {
            console.log('https://' + request.url.split('://')[1]);
            resp.pipe(response);

        }).on('error', err => {
            console.log('Error: ', err.message);
        });
    }*/

}).listen(8000);