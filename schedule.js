'use strict';

const {requestGroupUrl, parse} = require('./parsing.js');

const getSchedule = function getSchedule(groupName) {
    return requestGroupUrl(groupName)
        .then(groupUrl => getScheduleText(groupUrl))
        .catch(error => {
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
    });
};

module.exports = {getSchedule};