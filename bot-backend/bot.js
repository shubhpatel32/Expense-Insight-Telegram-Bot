require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const connectDB = require("./utils/db");

// Import command handlers
const createGroup = require("./commands/creategroup");
const addExpense = require("./commands/addExpense");
const split = require("./commands/split");
const balance = require("./commands/balance");
const report = require("./commands/report");
const joinGroup = require("./commands/joingroup");
const leaveGroup = require("./commands/leavegroup");
const help = require("./commands/help");
const groupInfo = require("./commands/groupInfo");

// Replace with your own Telegram bot token
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Connect to MongoDB
connectDB();
console.log("Telegram bot started...");

// Function to handle commands

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome! Use /help to see available commands. Make sure that your telegram username exists."
  );
});

// Register command handlers
bot.onText(/\/creategroup (.+)/, (msg, match) => createGroup(bot, msg, match));
bot.onText(/\/addexpense (\d+) (.+)/, (msg, match) =>
  addExpense(bot, msg, match)
);
bot.onText(/\/split/, (msg) => split(bot, msg));
bot.onText(/\/balance/, (msg) => balance(bot, msg));
bot.onText(/\/report/, (msg) => report(bot, msg));
bot.onText(/\/joingroup (.+)/, (msg, match) => joinGroup(bot, msg, match));
bot.onText(/\/leavegroup/, (msg) => leaveGroup(bot, msg));
bot.onText(/\/groupinfo/, (msg) => groupInfo(bot, msg));
bot.onText(/\/help/, (msg) => help(bot, msg));
