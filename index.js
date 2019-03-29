'use strict'

const WebSocket = require('ws');

const webSock = new WebSocket('ws://echo.websocket.org');

let timer;

webSock.on('connection', (socket, request) => {
    console.log('connection', socket.address());
});

webSock.on('open', function open() {
    webSock.send('something');
    timer = setInterval(() => webSock.send('something'), 1000);
});

webSock.on('message', function incoming(data) {
    console.log(data);
});

webSock.on('upgrade', (response) => {
    console.log('Upgrade event');
});

webSock.on('close', () => {
    console.log('Closed');
    clearInterval(timer);
});