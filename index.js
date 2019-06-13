'use strict';

const Telegraf = require('telegraf');
const {getMessage} = require('./scholarships.js');

const bot = new Telegraf(process.env.BOT_TOKEN, { webhookReply: false });

bot.start(ctx => ctx.reply('Welcome!'));

bot.hears(/^[A-Za-z]+$/, ctx => {
    return getMessage(ctx.message.text.toLowerCase(), 1)
        .then(([messageText, keyboard]) => {
            ctx.reply(messageText, keyboard);
        })
        .catch(error => {
            if (error instanceof ReferenceError) {
                ctx.reply(error.message);
            } else {
                ctx.reply('Error occured');
            }
        });
});

bot.action(/\w+_\d+/, ctx => {
    return getMessage(...ctx.update.callback_query.data.split('_'))
        .then(([messageText, keyboard]) => {
            ctx.editMessageText(messageText, keyboard);
        });
});

bot.telegram.setWebhook('https://scholarship-bot.the-subliminal.now.sh');
module.exports = bot.webhookCallback('/');
