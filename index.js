'use strict';

const http = require('http');
//const https = require('https');
//const fs = require('fs');
const url = require('url');

//let content = fs.readFileSync('index.html');


const startServer = () => {

    const server = http.createServer((request, response) => {

        // console.log(request.url);
        console.log(request.url, url.parse(request.url).protocol);

        response.end('Hello world!');


        //if (request.url.split(':')[0] === 'http') {
            /*http.get(request.url, (resp) => {

                resp.pipe(response);
    
            }).on('error', err => {
                console.log('Error: ', err.message);
            });*/
        //}

        /*if (request.url.split(':')[0] === 'https') {
            https.get('https://' + request.url.split('://')[1], resp => {
                console.log('https://' + request.url.split('://')[1]);
                resp.pipe(response);
    
            }).on('error', err => {
                console.log('Error: ', err.message);
            });
        }*/

    });

    server.listen();

};

startServer();