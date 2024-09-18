// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const TelegramBot = require("node-telegram-bot-api");
// const connectDB = require("./utils/db");

// const createGroup = require("./commands/createGroup");
// const addExpense = require("./commands/addExpense");
// const split = require("./commands/split");
// const balance = require("./commands/balance");
// const report = require("./commands/report");
// const joinGroup = require("./commands/joinGroup");
// const leaveGroup = require("./commands/leaveGroup");
// const help = require("./commands/help");
// const groupInfo = require("./commands/groupInfo");

// const token = process.env.BOT_TOKEN;
// const isProduction = process.env.NODE_ENV === "production";

// const bot = new TelegramBot(token, { polling: !isProduction });

// connectDB();

// if (isProduction) {
//   const app = express();
//   const port = process.env.PORT || 3000;

//   app.use(bodyParser.json());

//   app.post(`/bot${token}`, (req, res) => {
//     bot.processUpdate(req.body);
//     res.sendStatus(200);
//   });

//   app.get("/", (req, res) => {
//     res.send("Welcome to the Expense Insight Telegram Bot!");
//   });

//   app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
//   });

//   const webhookUrl = `${process.env.RENDER_URL}/bot${token}`;
//   bot.setWebHook(webhookUrl);

//   module.exports = app;
// } else {
//   bot.onText(/\/start/, (msg) => {
//     const chatId = msg.chat.id;
//     bot.sendMessage(
//       chatId,
//       "Welcome! Use /help to see available commands. Make sure that your telegram username exists."
//     );
//   });

//   bot.onText(/\/creategroup (.+)/, (msg, match) =>
//     createGroup(bot, msg, match)
//   );
//   bot.onText(/\/addexpense (\d+) (.+)/, (msg, match) =>
//     addExpense(bot, msg, match)
//   );
//   bot.onText(/\/split/, (msg) => split(bot, msg));
//   bot.onText(/\/balance/, (msg) => balance(bot, msg));
//   bot.onText(/\/report/, (msg) => report(bot, msg));
//   bot.onText(/\/joingroup (.+)/, (msg, match) => joinGroup(bot, msg, match));
//   bot.onText(/\/leavegroup/, (msg) => leaveGroup(bot, msg));
//   bot.onText(/\/groupinfo/, (msg) => groupInfo(bot, msg));
//   bot.onText(/\/help/, (msg) => help(bot, msg));

//   module.exports = {};
// }


// Load environment variables
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./utils/db");

// Import bot commands
const createGroup = require("./commands/createGroup");
const addExpense = require("./commands/addExpense");
const split = require("./commands/split");
const balance = require("./commands/balance");
const report = require("./commands/report");
const joinGroup = require("./commands/joinGroup");
const leaveGroup = require("./commands/leaveGroup");
const help = require("./commands/help");
const groupInfo = require("./commands/groupInfo");

// Load environment variables
const token = process.env.BOT_TOKEN;
const isProduction = process.env.NODE_ENV === "production";

// Connect to the database
connectDB();

// Initialize Telegram bot
const bot = new TelegramBot(token, { polling: !isProduction });

if (isProduction) {
  // Production Mode
  const app = express();
  const port = process.env.PORT || 3000;

  // Middleware
  app.use(bodyParser.json());

  // Telegram webhook setup for production
  app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);  // Process incoming updates
    res.sendStatus(200);
  });

  app.get("/", (req, res) => {
    res.send("Welcome to the Expense Insight Telegram Bot!");
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port} in production mode`);
  });

  // Set webhook for Telegram bot
  const webhookUrl = `${process.env.RENDER_URL}/bot${token}`;
  bot.setWebHook(webhookUrl)
    .then(() => {
      console.log(`Webhook set to ${webhookUrl}`);
    })
    .catch((err) => {
      console.error("Error setting webhook:", err);
    });

  module.exports = app;
} else {
  // Development Mode
  console.log("Running in development mode with polling...");

  // Define bot commands
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Welcome! Use /help to see available commands. Make sure that your telegram username exists.");
  });

  bot.onText(/\/creategroup (.+)/, (msg, match) => createGroup(bot, msg, match));
  bot.onText(/\/addexpense (\d+) (.+)/, (msg, match) => addExpense(bot, msg, match));
  bot.onText(/\/split/, (msg) => split(bot, msg));
  bot.onText(/\/balance/, (msg) => balance(bot, msg));
  bot.onText(/\/report/, (msg) => report(bot, msg));
  bot.onText(/\/joingroup (.+)/, (msg, match) => joinGroup(bot, msg, match));
  bot.onText(/\/leavegroup/, (msg) => leaveGroup(bot, msg));
  bot.onText(/\/groupinfo/, (msg) => groupInfo(bot, msg));
  bot.onText(/\/help/, (msg) => help(bot, msg));

  module.exports = {};  // No Express server needed in development mode
}
