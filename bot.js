'use strict';

// require('dotenv').config();

const http = require('http');
// const localtunnel = require('localtunnel');
const Telegraf = require('telegraf');

const {getSchedule} = require('./index.js');

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

bot.telegram.setWebhook('node-labs-execution-parser.now.sh');
module.exports = http.createServer(bot.webhookCallback('/'));
/*server.listen(3000, () => {
    console.log('App listening on port 3000');

});*/