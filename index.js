'use strict';

const http = require('http');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const url = 'http://rozklad.kpi.ua/Schedules/ViewSchedule.aspx?g=894be0b0-9c4b-492e-a3d0-a6950cb1a3e1';

const parse = function parse(htmlData) {
    const lessons = [];
    const pairsPerTime = [];
    const document = new JSDOM(htmlData).window.document;
    const first_week = document.getElementById('ctl00_MainContent_FirstScheduleTable').getElementsByTagName('tr');
    for (let index in first_week) {
        if (index > 0 && index < 5) {
            pairsPerTime.push(first_week[index].getElementsByTagName('td'));
        }
    }
    //console.log(pairsPerTime[0][1].getElementsByTagName('a')[0].innerHTML);
    for (let day of pairsPerTime) {
        let nthLessonOfWeek = [];
        for (let pair in day) {
            if (pair > 0 && pair < 6) {
                let lesson = {};
                let tags = day[pair].getElementsByTagName('a');
                if (!tags[0]) {
                    lesson = {};
                }
                else {
                    lesson.name = tags[0].innerHTML;
                    try {
                        lesson.teacher = tags[1].innerHTML;
                    }
                    catch (err) {
                        lesson.teacher = '';
                    }
                    try {
                        lesson.place = tags[2].innerHTML;
                    }
                    catch (err) {
                        lesson.place = '';
                    }
                }
                nthLessonOfWeek.push(lesson);
            }
        }
        lessons.push(nthLessonOfWeek);
    }
    console.log(lessons);
};

http.get(url, (response) => {

    let data = '';

    response.on('data', chunk => {
       data += chunk;
    });

    response.on('end', () => {
        parse(data);
    });
}).on('error', err => {
    console.log('ERROR GET: ', err.message);
});
