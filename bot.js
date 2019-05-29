'use strict';

require('dotenv').config();

const Telegraf = require('telegraf');
const {getSchedule} = require('./index.js');

const bot = new Telegraf(process.env.BOT_TOKEN/*, { telegram: { webhookReply: true }}*/);

bot.start(ctx => ctx.reply('Welcome!'));

bot.hears(/^[А-ЯІа-яі]{2}-\d\d$/, ctx => {
    getSchedule(ctx.message.text)
        .then(result => ctx.reply(result))
        .catch(error => {
            if (error instanceof ReferenceError) {
                ctx.reply(error.message);
            } else {
                ctx.reply('An error occured');
            }
        });
    //getSchedule(ctx.message.text).then(result => ctx.webhookReply(result)).catch(() => ctx.reply('An error occured'));
});

bot.launch();

/*bot.telegram.setWebhook('https://postb.in/1559156301170-6775505274999');
bot.startWebhook('/1559156301170-6775505274999', null, 443);*/
