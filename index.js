'use strict';

const Telegraf = require('telegraf');

const {getScholarships} = require('./scholarships.js');

const bot = new Telegraf(process.env.BOT_TOKEN, { webhookReply: false });

bot.start(ctx => ctx.reply('Welcome!'));

bot.hears(/^[A-Za-z]+$/, ctx => {
    return getScholarships(ctx.message.text)
        .then(result => {
            ctx.reply(result.toLowerCase());
        })
        .catch(error => {
            if (error instanceof ReferenceError) {
                ctx.reply(error.message);
            } else {
                ctx.reply('An error occured');
            }
        });
});


bot.telegram.setWebhook('https://scholarship-bot.the-subliminal.now.sh');
module.exports = bot.webhookCallback('/');
