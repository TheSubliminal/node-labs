const formDays = function formDays(weekLessonsByTime) {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Create structure of the Map - [dayName, lessons]
    const initialWeek = [];

    weekDays.forEach(day => {
        initialWeek.push([day, []]);
    });

    const days = new Map(initialWeek);

    let scheduleForDay;
    // For each nth lessons
    weekLessonsByTime.forEach((lessonsPerNumber, idx) => {
        // For each individual lesson
        Object.keys(lessonsPerNumber).forEach(i => { // no filter because need to keep "i" index to get right week day
            // Append lesson to the corresponding day
            if (Object.keys(lessonsPerNumber[i]).length) {
                lessonsPerNumber[i].number = idx + 1;
                scheduleForDay = days.get(weekDays[i]);
                scheduleForDay.push(lessonsPerNumber[i]);
            }
        });
    });

    return days;
};

const lessonsPerWeek = function lessonsPerWeek(weekTable) {
    // Slice off index column
    const lessonsPerTime = [...weekTable].slice(1).map(elem => elem.getElementsByTagName('td'));
    // Array of arrays with objects with info about first lesson through entire week, second, etc
    return lessonsPerTime.map(nthLessonOfWeekElements => {
        // Slice off index row
        return [...nthLessonOfWeekElements].slice(1).map(lessonElem => {
            let lesson = {};
            // Get all tags with data
            let tags = lessonElem.getElementsByTagName('a');

            if (tags.length) {
                lesson = parseAnchorTags(tags);
            }
            return lesson;
        });
    });
};

const parseAnchorTags = function parseAnchorTags(tags) {
    let lesson = {};

    // First tag - with lesson name
    lesson.name = tags[0].textContent;
    let teachers = [], places = [];
    // Get all teachers and places by selecting all <a> tags with the following URL pattern
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

    return lesson;
};

module.exports = {formDays, lessonsPerWeek};