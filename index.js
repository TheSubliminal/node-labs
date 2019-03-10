'use strict';

const http = require('http');
const fs = require('fs');

let content = fs.readFileSync('index.html');


const startServer = (content, err) => {
    if (err) throw err;

    const server = http.createServer((request, response) => {

        console.log(request.url);

        response.end(content);


        //if (request.url.split(':')[0] === 'http') {
            /*(http.get(request.url, (resp) => {

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

    server.listen(8000);

};

startServer(content.toString());