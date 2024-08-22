const Group = require("../models/group");
const User = require("../models/user");

module.exports = async function balance(bot, msg) {
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
      const balances = {};
      group.members.forEach((member) => {
        balances[member] = 0;
      });

      group.expenses.forEach((expense) => {
        const share = expense.amount / group.members.length;
        group.members.forEach((member) => {
          if (member === expense.payer) {
            balances[member] += expense.amount - share;
          } else {
            balances[member] -= share;
          }
        });
      });

      let payments = [];
      const members = Object.keys(balances);

      for (let i = 0; i < members.length; i++) {
        for (let j = 0; j < members.length; j++) {
          if (i !== j && balances[members[i]] > 0 && balances[members[j]] < 0) {
            const amount = Math.min(
              balances[members[i]],
              Math.abs(balances[members[j]])
            );

            payments.push(
              `${members[j]} should pay ${members[i]} ₹${amount.toFixed(2)}`
            );
            balances[members[i]] -= amount;
            balances[members[j]] += amount;
          }
        }
      }

      const balanceReport =
        payments.length > 0
          ? `Payments:\n${payments.join("\n")}`
          : "All balances are settled.";

      bot.sendMessage(chatId, balanceReport);
    } else {
      bot.sendMessage(chatId, "Group not found.");
    }
  } catch (error) {
    console.log("Error in calculating balances", error);
    bot.sendMessage(
      chatId,
      "An error occurred while calculating balances. Please try again later."
    );
  }
};
