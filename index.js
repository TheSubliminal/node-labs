'use strict';

const Telegraf = require('telegraf');

const {getSchedule} = require('./schedule.js');

const bot = new Telegraf(process.env.BOT_TOKEN, { webhookReply: false });

bot.start(ctx => ctx.reply('Welcome!'));

bot.hears(/^[А-ЯІа-яі]{2}-\d\d$/, ctx => {
    return getSchedule(ctx.message.text)
        .then(result => {
            ctx.reply(result);
        })
        .catch(error => {
            if (error instanceof ReferenceError) {
                ctx.reply(error.message);
            } else {
                ctx.reply('An error occured');
            }
        });
});


bot.telegram.setWebhook('https://kpi-schedule-bot.the-subliminal.now.sh');
module.exports = bot.webhookCallback('/');
