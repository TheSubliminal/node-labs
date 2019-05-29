'use strict';

const http = require('http');
const { JSDOM } = require("jsdom");
const request = require('request');

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

const getSchedule = function getSchedule(groupName) {
    return requestGroupUrl(groupName).then(groupUrl => {
        return getScheduleText(groupUrl);
    }).catch(error => {
        if (error instanceof ReferenceError) {
            throw error;
        }
    });
};

const parse = function parse(htmlData) {
    const document = new JSDOM(htmlData).window.document;

    // Get table row of table with the first week lessons
    const firstWeekTable = document.getElementById('ctl00_MainContent_FirstScheduleTable').getElementsByTagName('tr');
    // Get an array of lessons for the entire week
    const firstWeekLessons = lessonsPerWeek(firstWeekTable);
    // Create dictionary with entries: { dayName: objectWithLessons }
    const firstWeek = formDays(firstWeekLessons);

    //Filter out empty days
    [...firstWeek.entries()].forEach(entry => {
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
};

const formDays = function formDays(weekLessonsByTime) {

    const weekDays = ['Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday'];

    // Create structure of the Map - [dayName, lessons]
    const initialWeek = [];
    Object.keys(weekLessonsByTime[0]).forEach(idx => {
        initialWeek.push([weekDays[idx], []]);
    });

    const days = new Map(initialWeek);

    let scheduleForDay;
    // For each nth lessons
    let lessonNumber = 1;
    for (let lessonsPerNumber of weekLessonsByTime) {
        // For each individual lesson
        Object.keys(lessonsPerNumber).forEach(i => {
            // Append lesson to the corresponding day
            if (Object.keys(lessonsPerNumber[i]).length) {
                lessonsPerNumber[i].number = lessonNumber;
                scheduleForDay = days.get(weekDays[i]);
                scheduleForDay.push(lessonsPerNumber[i]);
            }
        });
        lessonNumber++;
    }

    return days;
};

const lessonsPerWeek = function lessonsPerWeek(weekTable) {
    // Array of arrays with objects with info about first lesson through entire week, second, etc
    const lessons = [];
    // Array of arrays each of which contains DOM elements with info about first, second, etc lessons of the week
    const lessonsPerTime = [];

    const headerIdx = 0;

    // For each row of lesson
    Object.keys(weekTable).forEach((index) => {
        // Not including header and empty lessons
        if (index > headerIdx) {
            lessonsPerTime.push(weekTable[index].getElementsByTagName('td'));
        }
    });

    const indexColumn = 0;
    // For each day of nth lessons for entire week
    for (let nthLessonForWeek of lessonsPerTime) {
        let nthLessonOfWeek = [];
        // Iterate over lessons
        Object.keys(nthLessonForWeek).forEach(lessonIdx => {
            if (lessonIdx > indexColumn) {
                let lesson = {};
                // Get all tags with data
                let tags = nthLessonForWeek[lessonIdx].getElementsByTagName('a');

                if (tags.length !== 0) {
                    lesson.name = tags[0].innerHTML;
                    let teachers = [], places = [];
                    // Get all teachers by selecting all <a> tags with the following URL pattern
                    for (let i = 1; i < tags.length; i++) {
                        if (tags[i].getAttribute('href').includes('/Schedules/ViewSchedule')) {
                            teachers.push(tags[i].innerHTML);
                        }
                        // Get all places by selecting all <a> tags with the following URL pattern
                        else if (tags[i].getAttribute('href').includes('maps.google.com')) {
                            places.push(tags[i].innerHTML);
                        }
                    }
                    lesson.teacher = teachers.join(', ');
                    lesson.place = places.join(', ');
                }
                nthLessonOfWeek.push(lesson);
            }
        });
        lessons.push(nthLessonOfWeek);
    }
    return lessons;
};

const getScheduleText = function getScheduleText(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            let data = '';
            let result = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                result = parse(data);
                resolve(result);
            });
        }).on('error', err => {
            console.log(err);
            if (err.code === 'ENOTFOUND') {
                reject(new ReferenceError('Group not found!'));
            }
        });
    });

};

module.exports = {getSchedule};