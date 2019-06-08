const formDays = function formDays(weekLessonsByTime) {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
        Object.keys(lessonsPerNumber).forEach(i => { // no filter because need to keep "i" index to get right week day
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
    const lessonsPerTime = [...weekTable].slice(1).map(elem => elem.getElementsByTagName('td'));
    // Array of arrays with objects with info about first lesson through entire week, second, etc
    return lessonsPerTime.map(nthLessonOfWeekElements => {
        return [...nthLessonOfWeekElements].slice(1).map(lessonElem => {
            let lesson = {};
            // Get all tags with data
            let tags = lessonElem.getElementsByTagName('a');

            if (tags.length) {
                lesson.name = tags[0].textContent;
                let teachers = [], places = [];
                // Get all teachers by selecting all <a> tags with the following URL pattern
                [...tags].forEach(tag => {
                    if (tag.getAttribute('href').includes('/Schedules/ViewSchedule')) {
                        teachers.push(tag.textContent);
                    }
                    // Get all places by selecting all <a> tags with the following URL pattern
                    else if (tag.getAttribute('href').includes('maps.google.com')) {
                        places.push(tag.textContent);
                    }
                });
                lesson.teacher = teachers.join(', ');
                lesson.place = places.join(', ');
            }
            return lesson;
        });
    });
};

module.exports = {formDays, lessonsPerWeek};