const { JSDOM } = require("jsdom");
const request = require('request');

const {formDays, lessonsPerWeek} = require('./dataFormatting.js');

const URL = 'http://rozklad.kpi.ua/Schedules/ScheduleGroupSelection.aspx';

const requestGroupUrl = function requestGroupUrl(groupName) {
    return JSDOM.fromURL(URL).then(dom => {
        const document = dom.window.document;
        const formElement = document.getElementById('aspnetForm');
        const hiddenInputs = formElement.querySelectorAll('input[type="hidden"]');
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
        const firstWeekLessons = lessonsPerWeek(firstWeekTable);
        // Create dictionary with entries: { dayName: objectWithLessons }
        const firstWeek = formDays(firstWeekLessons);

        //Filter out empty days
        [...firstWeek.entries()].forEach(entry => {
            console.log(entry[0], entry[1]);
            let dayName = entry[0];
            let schedule = entry[1];
            if (!schedule.length) {
                firstWeek.delete(dayName);
            }
        });

        let result = '';

        for (let [day, schedule] of firstWeek.entries()) {
            result += `\n\nSchedule for ${day}:\n`;
            for (let lesson of schedule) {
                let name = lesson.name;
                if (name) {
                    result += `${lesson.number}) ${name}\n`;

                    let teacher = lesson.teacher;
                    if (teacher) {
                        result += `Teacher: ${teacher}\n`
                    }

                    let place = lesson.place;
                    if (place) {
                        result += `Place: ${place}\n`;
                    }
                }
            }
        }

        return result;
    });
};

module.exports = {requestGroupUrl, parse};