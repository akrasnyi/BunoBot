const Telegraf = require('telegraf');
const Koa = require('koa');
const koaBody = require('koa-body');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
	console.log('Id пользователя:', ctx.from.id);
	return ctx.reply('Welcome!')
})
bot.help((ctx) => ctx.reply('Send me a sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.hears(/buy/i, (ctx) => ctx.reply('Buy-buy'))

bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('modern', ({ reply }) => reply('Yo'))
bot.command('hipster', Telegraf.reply('λ'))

bot.telegram.setWebhook('https://buno-bot.herokuapp.com/secret-path');

const app = new Koa();
app.use(koaBody());
app.use((ctx, next) => ctx.method === 'POST' || ctx.url === '/secret-path' ? bot.handleUpdate(ctx.request.body, ctx.response) : next());
app.listen(process.env.PORT);