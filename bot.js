const Telegraf = require('telegraf');
const {getSchedule} = require('./index.js');

const bot = new Telegraf('814142498:AAHlynehz6_BPt2c88aKPoMpD1D67fFRiFM');

bot.start(ctx => ctx.reply('Welcome!'));

bot.command('schedule', ctx => getSchedule().then(result => { ctx.reply(result); }));

bot.launch();
