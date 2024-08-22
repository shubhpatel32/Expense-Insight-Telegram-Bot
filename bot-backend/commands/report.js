const Group = require("../models/group");
const User = require("../models/user");

module.exports = async function report(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    const user = await User.findOne({ username });
    if (!user || !user.groupId) {
      bot.sendMessage(chatId, "You are not part of any group.");
      return;
    }

    const group = await Group.findById(user.groupId);
    if (group) {
      const report = group.expenses
        .map(
          (exp) =>
            `Amount: ₹ ${exp.amount.toFixed(2)}, Description: ${
              exp.description
            }, Payer: ${exp.payer}`
        )
        .join("\n");

      if (report) {
        bot.sendMessage(chatId, `Expense Report:\n${report}`);
      } else {
        bot.sendMessage(chatId, "No expenses found for this group.");
      }
    } else {
      bot.sendMessage(chatId, "Group not found.");
    }
  } catch (error) {
    console.log("Error generating report:", error);
    bot.sendMessage(
      chatId,
      "An error occurred while generating the report. Please try again later."
    );
  }
};
