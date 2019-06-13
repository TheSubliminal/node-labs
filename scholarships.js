const {requestScholarshipsHtml, getScholarshipsListDivs} = require('./parsing');
const {formatScholarships, formatResult} = require('./dataFormatting');
const Markup = require('telegraf/markup');

const getMessage = function getMessage (countryName, pageNumber) {
    return requestScholarshipsHtml(countryName, pageNumber).then(scholarshipList => {
        const scholarshipsTitle = scholarshipList.firstElementChild.textContent;

        const keyboard = getPagination(countryName, [...scholarshipList.getElementsByTagName('div')].slice(-1).pop()); // Get last div with pagination
        const messageText = formatResult(scholarshipsTitle, formatScholarships(getScholarshipsListDivs(scholarshipList)));

        return [messageText, keyboard];
    });
};

const getPagination = function getPagination(countryName, paginationDiv) {
    // Get pagination buttons
    const prevButton = paginationDiv.querySelector('[rel=prev]');
    const nextButton = paginationDiv.querySelector('[rel=next]');

    const keys = [];
    if (prevButton) keys.push(Markup.callbackButton('⬅', `${countryName}_${prevButton.href.slice(-1)}`)); // Get last char of the link - page number
    if (nextButton) keys.push(Markup.callbackButton('➡', `${countryName}_${nextButton.href.slice(-1)}`));

    return Markup.inlineKeyboard(keys).extra();
};

module.exports = {getMessage};