const formatScholarships = function formatScholarships(scholarshipList) {
    return scholarshipList.map(scholarshipDiv => {
        const scholarshipTitle = scholarshipDiv.querySelector('h3.scholarship__title').textContent;
        const [money, deadline] = [...scholarshipDiv.querySelectorAll('ul.list.list--labels.scholarship__labels li')]
            .map(li => li.classList.contains('expired') ? `${li.textContent} (Expired!)` : li.textContent);
        const scholarshipLink = scholarshipDiv.firstElementChild.href;

        return `${scholarshipTitle}\n${money}\n${deadline}\n${scholarshipLink}\n\n`;
    }).join('');
};

const formatResult = function formatResult(scholarshipsTitle, scholarships) {
    return `${scholarshipsTitle}\n\n${scholarships}`;
};

module.exports = {formatScholarships, formatResult};