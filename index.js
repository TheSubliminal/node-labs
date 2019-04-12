'use strict';

const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const URL = 'http://rozklad.kpi.ua/Schedules/ViewSchedule.aspx?g=894be0b0-9c4b-492e-a3d0-a6950cb1a3e1';

const parse = function parse(htmlData) {

    const document = new JSDOM(htmlData).window.document;

    // Get table row of table with the first week lessons
    const firstWeekTable = document.getElementById('ctl00_MainContent_FirstScheduleTable').getElementsByTagName('tr');
    // Get an array of lessons for the entire week
    const firstWeekLessons = lessonsPerWeek(firstWeekTable);
    // Create dictionary with entries: { dayName: objectWithLessons }
    const firstWeek = formDays(firstWeekLessons);

    let result = '';

    for (let [day, schedule] of firstWeek.entries()) {
        result += `\n\nSchedule for ${day}:\n-----------`;
        for (let lesson of schedule) {
            if (lesson.name) {
                result += `\nPair: ${lesson.name}\nTeacher: ${lesson.teacher}\nPlace: ${lesson.place}\n-----------`;
            } else {
                result += '\nNo pair\n-----------';
            }
        }
    }

    return result;

};

const formDays = function formDays(lessonsByTime) {

    const weekDays = ['Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Create structure of the Map - [dayName, lessons]
    const initialWeek = [];
    Object.keys(lessonsByTime[0]).forEach(idx => {
        initialWeek.push([weekDays[idx], []]);
    });


    const days = new Map(initialWeek);

    let scheduleForDay;
    // For each nth lessons
    for (let lessonNumber of lessonsByTime) {
        // For each individual lesson
        Object.keys(lessonNumber).forEach(nthDay => {
            // Append lesson to the corresponding day
            scheduleForDay = days.get(weekDays[nthDay]);
            scheduleForDay.push(lessonNumber[nthDay]);
        });
    }

    return days;
};

const lessonsPerWeek = function lessonsPerWeek(weekTable) {
    // Array of arrays with objects with info about first lesson through entire week, second, etc
    const lessons = [];
    // Array of arrays each of which contains DOM elements with info about first, second, etc lessons of the week
    const lessonsPerTime = [];

    const headerIdx = 0, maxPairs = 4;

    // For each row of lesson
    Object.keys(weekTable).forEach((index) => {
        // Not including header and empty lessons
        if (index > headerIdx && index <= maxPairs) {
            lessonsPerTime.push(weekTable[index].getElementsByTagName('td'));
        }
    });

    const indexColumn = 0, saturdayColumn = 6;
    // For each day of nth lessons for entire week
    for (let nthLessonForWeek of lessonsPerTime) {
        let nthLessonOfWeek = [];
        // Iterate over lessons
        Object.keys(nthLessonForWeek).forEach(lessonIdx => {
            if (lessonIdx > indexColumn && lessonIdx < saturdayColumn) {
                let lesson = {};
                // Get all tags with data
                let tags = nthLessonForWeek[lessonIdx].getElementsByTagName('a');
                if (tags.length === 0) {
                    lesson = {};
                }
                else {
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

const getSchedule = async function getSchedule() {

    return new Promise((resolve) => {

        http.get(URL, (response) => {

            let data = '';
            let result = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                result = parse(data);
                resolve(result)
            });
        }).on('error', err => {
            console.log('ERROR GET: ', err.message);
        });
    });

};

module.exports = {getSchedule};