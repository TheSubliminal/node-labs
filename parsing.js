const { JSDOM } = require('jsdom');

const BASE_URL = 'https://www.scholarshipportal.com/scholarships/';

const requestScholarshipsHtml = function requestScholarshipsHtml(countryName, pageNumber = 1) {
    return JSDOM.fromURL(`${BASE_URL}${countryName}?page=${pageNumber}`)
        .then(dom => {
            const document = dom.window.document;
            return document.body.querySelector('.container .row .col-sm-8.col-md-9').firstElementChild;
        })
        .catch(error => {
            if (error.statusCode === 404) {
                throw new ReferenceError('Invalid country name');
            }
        });
};

const getScholarshipsListDivs = function getScholarshipsListDivs (scholarshipList) {
    return [...scholarshipList.getElementsByTagName('div')]
        .slice(1, -1) // Slice off first div with metadata and last div with pagination
        .filter(div => div.previousElementSibling.tagName !== 'P' && div.previousElementSibling.tagName !== 'A'); // Filter out divs with ads
};

module.exports = {requestScholarshipsHtml, getScholarshipsListDivs};