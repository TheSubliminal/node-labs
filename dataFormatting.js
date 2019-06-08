const formDays = function formDays(weekLessonsByTime) {

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Create structure of the Map - [dayName, lessons]
    const initialWeek = [];
    // todo check if exists
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
                    lesson.name = tags[0].textContent;
                    let teachers = [], places = [];
                    // Get all teachers by selecting all <a> tags with the following URL pattern
                    Object.values(tags).forEach(tag => {
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
                nthLessonOfWeek.push(lesson);
            }
        });
        lessons.push(nthLessonOfWeek);
    }
    return lessons;
};

module.exports = {formDays, lessonsPerWeek};