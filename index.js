'use strict'

const https = require('https');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');

//const proxy = (request, response) => {
const proxy = http.createServer((request, response) => {

    //response.setHeader('Content-Type', 'text/javascript');

    let reqUrl = url.parse(request.url);
    //console.dir(reqUrl);
    if (request.url === '/') {
        console.log('REQUEST TO SERVER\'S PAGE', new Date().toLocaleTimeString());
        response.end('This is server\'s page');
    } else if (reqUrl.protocol === 'http:') {
        console.log('HTTP GET:', request.url, new Date().toLocaleTimeString());
        http.get(request.url, (resp) => {
            resp.pipe(response);
        }).on('error', err => {
            console.log('HTTP ERROR: ', err.message);
        });
    } else if (reqUrl.protocol === 'https:') {
        console.log('HTTPS GET:', request.url, new Date().toLocaleTimeString());
        https.get(request.url, (resp) => {
            resp.pipe(response);
        }).on('error', err => {
            console.log('HTTPS ERROR: ', err.message);
        });
    }
});
//};

proxy.on('upgrade', (request, cltSocket) => {
    console.log('UPGRADE EVENT: ', request.url, new Date().toLocaleTimeString());

}).on('error', (err) => {
    console.log('ERROR UPGRADE: ', err);
});

proxy.on('connect', (request, cltSocket) => {
   console.log('CONNECT', request.url);
   if (!request.url.includes('443')) {
       const ws = new WebSocket('ws://echo.websocket.org/', {
           origin: 'http://websocket.org'
       });

       ws.on('open', function open() {
           console.log('connected');
           cltSocket.pipe(ws);
           ws.send(Date.now());
       });

       ws.on('close', function close() {
           console.log('disconnected');
       });

       ws.on('message', function incoming(data) {
           console.log(`Roundtrip time: ${Date.now() - data} ms`);

           setTimeout(function timeout() {
               ws.send(Date.now());
           }, 500);
       });

   }
});

const listener = proxy.listen(8000, (err) => {
    const SERVER_IP = listener.address().address;
    const SERVER_PORT = listener.address().port;
    console.log(`Listening on IP: ${SERVER_IP} with PORT: ${SERVER_PORT}`);
    if (err) {
        console.log('ERROR LISTEN: ', err);
    }
});

module.exports = proxy;