'use strict';

const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const URL = 'http://rozklad.kpi.ua/Schedules/ViewSchedule.aspx?g=894be0b0-9c4b-492e-a3d0-a6950cb1a3e1';

const parse = function parse(htmlData) {

    const document = new JSDOM(htmlData).window.document;

    const firstWeekTable = document.getElementById('ctl00_MainContent_FirstScheduleTable').getElementsByTagName('tr');
    const secondWeekTable = document.getElementById('ctl00_MainContent_SecondScheduleTable').getElementsByTagName('tr');
    const firstWeekLessons = lessonsPerWeek(firstWeekTable);
    const secondWeekLessons = lessonsPerWeek(secondWeekTable);
    const firstWeek = formDays(firstWeekLessons);
    const secondWeek = formDays(secondWeekLessons);

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

    const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const initialWeek = [];
    for (let idx in lessonsByTime[0]) {
        initialWeek.push([WEEK_DAYS[idx], []]);
    }
    const days = new Map(initialWeek);

    let scheduleForDay;
    for (let lessonNumber of lessonsByTime) {
        for (let nthDay in lessonNumber)
        {
            scheduleForDay = days.get(WEEK_DAYS[nthDay]);
            scheduleForDay.push(lessonNumber[nthDay]);
            //days.set(WEEK_DAYS[nthDay], scheduleForDay.push(lessonNumber[nthDay]));
        }
    }

    return days;
};

const lessonsPerWeek = function lessonsPerWeek(weekTable) {

    const lessons = [];
    const pairsPerTime = [];

    for (let index in weekTable) {
        if (index > 0 && index < 5) {
            pairsPerTime.push(weekTable[index].getElementsByTagName('td'));
        }
    }
    //console.log(pairsPerTime[0][1].getElementsByTagName('a')[0].innerHTML);
    for (let day of pairsPerTime) {
        let nthLessonOfWeek = [];
        for (let pair in day) {
            if (pair > 0 && pair < 6) {
                let lesson = {};
                let tags = day[pair].getElementsByTagName('a');
                if (tags.length === 0) {
                    lesson = {};
                }
                else {
                    lesson.name = tags[0].innerHTML;
                    let teachers = [], places = [];
                    for (let i = 1; i < tags.length; i++) {
                        if (tags[i].getAttribute('href').includes('/Schedules/ViewSchedule')) {
                            teachers.push(tags[i].innerHTML);
                        }
                        else if (tags[i].getAttribute('href').includes('maps.google.com')) {
                            places.push(tags[i].innerHTML);
                        }
                    }
                    lesson.teacher = teachers.join(', ');
                    lesson.place = places.join(', ');
                }
                nthLessonOfWeek.push(lesson);
            }
        }
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