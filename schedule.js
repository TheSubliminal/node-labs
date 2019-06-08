'use strict';

const {requestGroupUrl, parse} = require('./parsing.js');

const getSchedule = function getSchedule(groupName) {
    return requestGroupUrl(groupName).then(groupUrl => {
        return getScheduleText(groupUrl);
    }).catch(error => {
        throw error;
    });
};

const getScheduleText = function getScheduleText(url) {
    return new Promise((resolve, reject) => {
        parse(url)
            .then(result => resolve(result))
            .catch(error => {
                if (error.code === 'ENOTFOUND') {
                    reject(new ReferenceError('Group not found!'));
                }
            });
        /*http.get(url, (response) => {
            let data = '';
            let result = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    result = parse(data);
                } catch (error) {
                    reject(error);
                }
                resolve(result);
            });
        }).on('error', err => {
            if (err.code === 'ENOTFOUND') {
                reject(new ReferenceError('Group not found!'));
            }
        });*/
    });

};

getSchedule('іс-72').then(result => console.log(result));

module.exports = {getSchedule};