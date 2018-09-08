const Telegraf = require('telegraf')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const WizardScene = require('telegraf/scenes/wizard')

const bot = new Telegraf(process.env.BOT_TOKEN)

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

// Сцена создания новой партии
let players = []
let playersObj = {}
const create = new WizardScene(
    "create", // Имя сцены
    (ctx) => {
      ctx.reply(`Имена игроков через запятую`);
      return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
      Object.assign(playersObj, ctx.message.text.split(','))
      console.log(playersObj)
      Object.keys(playersObj).forEach(e => {
        playersObj[e] = {name: playersObj[e], score: 0}
      })
      console.log(playersObj)
      ctx.reply(`${JSON.stringify(playersObj, null, 4)}}`);
      return ctx.wizard.next()
    },
    
    // ...
  
    (ctx) => {
      ctx.reply('Финальный этап: создание матча.');
      return ctx.scene.leave();
    }
  );
  
  const round = new WizardScene(
    "round", // Имя сцены
    (ctx) => {
      ctx.reply(`Счет за раунд`);
      return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
      let scoreArr = ctx.message.text.split(',')
      console.log(scoreArr)
      Object.keys(playersObj).forEach(e => {
        playersObj[e].score += +scoreArr[e]
      })
      console.log(playersObj)
      ctx.reply(`${JSON.stringify(playersObj, null, 4)}`);
      return ctx.wizard.next()
    },
    
    // ...
  
    (ctx) => {
      ctx.reply('Финальный этап: создание матча.');
      return ctx.scene.leave();
    }
  );
  
  const stage = new Stage();
  stage.register(round);
  stage.register(create);
  
  bot.use(session());
  bot.use(stage.middleware());
  bot.command("round", (ctx) => ctx.scene.enter("round"));
  bot.command("create", (ctx) => ctx.scene.enter("create"));

bot.startPolling()