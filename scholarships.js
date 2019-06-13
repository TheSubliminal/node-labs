const {requestScholarshipsHtml, getScholarshipsListDivs} = require('./parsing');
const {formatScholarships, formatResult} = require('./dataFormatting');

const getScholarshipsPerPage = function getScholarships (countryName, pageNumber) {
    return requestScholarshipsHtml(countryName, pageNumber).then(scholarshipList => {
        const scholarshipsTitle = scholarshipList.firstElementChild.textContent;
        const scholarshipDivs = getScholarshipsListDivs(scholarshipList);
        return formatResult(scholarshipsTitle, formatScholarships(scholarshipDivs));
    });
};



getScholarshipsPerPage('denmark', 3).then(result => console.log(result));