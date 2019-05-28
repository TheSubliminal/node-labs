'use strict';

require('dotenv').config();

const Telegraf = require('telegraf');
const {getSchedule} = require('./index.js');

const bot = new Telegraf(process.env.BOT_TOKEN, { telegram: { webhookReply: true }});

bot.start(ctx => ctx.reply('Welcome!'));

bot.hears(/^[А-ЯІа-яі]{2}-\d\d$/, ctx => {
    getSchedule(ctx.message.text).then(result => ctx.webhookReply(result)).catch(() => ctx.reply('An error occured'));
});

bot.telegram.setWebhook('https://webhook.site/71c156b9-f1e6-46a8-924a-1cd071ed814d');
bot.startWebhook('/71c156b9-f1e6-46a8-924a-1cd071ed814d', null, 443);