module.exports = function help(bot, msg) {
  const chatId = msg.chat.id;
  const helpMessage = `
Available commands:
/creategroup <group_name> - Create a new group
/joingroup <group_id> - Join a group by ID
/leavegroup - Leave the current group
/addexpense <amount> <description> - Add an expense to the current group
/split - Calculate how much each member owes
/balance - Show the balance of each member
/report - Get a detailed report of all expenses
/groupinfo - Show the current group status
/help - Show this help message
`;

  bot.sendMessage(chatId, helpMessage);
};
