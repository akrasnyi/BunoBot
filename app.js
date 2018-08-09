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
let playerQty = 0
let players = []
const create = new WizardScene(
    "create", // Имя сцены
    (ctx) => {
      ctx.reply('Этап 1: Количество игроков');
      return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    (ctx) => {
      console.log('qty: ', ctx.message.text)
      if (!Number.isInteger(parseInt(ctx.message.text))){
        ctx.reply('Значение должно быть числом');
        // ctx.wizard.back(); // Вернуться к предыдущиму обработчику
      } else {
        playerQty = parseInt(ctx.message.text) //Saving state, should be rewritten to session
        return ctx.wizard.next(); // Переходим к следующему обработчику.
      }
    },
    (ctx) => {
      let i = 0
      while (i < playerQty){
        ctx.reply(`Имя игрока ${i}`);
        players.push(ctx.message.text)
        i++
      }
      console.log(players)
      return ctx.wizard.next()
    },
    
    // ...
  
    (ctx) => {
      ctx.reply('Финальный этап: создание матча.');
      return ctx.scene.leave();
    }
  );
  
  // Создаем менеджера сцен
  const stage = new Stage();
  
  // Регистрируем сцену создания матча
  stage.register(create);
  
  bot.use(session());
  bot.use(stage.middleware());
  bot.command("create", (ctx) => ctx.scene.enter("create"));

bot.startPolling()