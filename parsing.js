const { JSDOM } = require("jsdom");
const request = require('request');

const {formDays, lessonsPerWeek} = require('./dataFormatting.js');

const URL = 'http://rozklad.kpi.ua/Schedules/ScheduleGroupSelection.aspx';

const requestGroupUrl = function requestGroupUrl(groupName) {
    return JSDOM.fromURL(URL).then(dom => {
        const document = dom.window.document;
        const hiddenInputs = document.getElementById('aspnetForm').querySelectorAll('input[type="hidden"]');
        const form = {
            ctl00$MainContent$ctl00$txtboxGroup: groupName,
            ctl00$MainContent$ctl00$btnShowSchedule: 'Розклад занять'
        };

        [...hiddenInputs].forEach(elem => {
            form[elem.name] = elem.value;
        });

        return new Promise(resolve => {
            request.post({
                url: URL,
                form
            }, (err, res) => {
                resolve(`http://rozklad.kpi.ua${res.headers.location}`);
            });
        });
    });
};

const parse = function parse(url) {
    return JSDOM.fromURL(url).then(dom => {
        const document = dom.window.document;

        // Get table row of table with the first week lessons
        const firstWeekTable = document.getElementById('ctl00_MainContent_FirstScheduleTable').getElementsByTagName('tr');
        // Get an array of lessons for the entire week
        // Create Map with entries: { dayName: objectWithLessons }
        const firstWeek = formDays(lessonsPerWeek(firstWeekTable));

        return [...firstWeek.entries()]
            .filter(([, schedule]) => schedule.length) // Filter out empty days from Map
            .reduce((acc, [day, schedule]) => {
                acc += `\n\nSchedule for ${day}:\n`;
                acc += formatLessonsPerDay(schedule);
                return acc;
            }, '');
    });
};

const formatLessonsPerDay = function formatLessonsPerDay(schedule) {
    return schedule.filter(({name}) => !!name).reduce((result, {name, number, teacher, place}) => {
        result += `${number}) ${name}\n`;
        if (teacher) {
            result += `Teacher: ${teacher}\n`
        }

        if (place) {
            result += `Place: ${place}\n`;
        }
        return result;
    }, '');
};

module.exports = {requestGroupUrl, parse};