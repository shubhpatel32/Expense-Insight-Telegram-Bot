const Group = require("../models/group");
const User = require("../models/user");

module.exports = async function split(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    const user = await User.findOne({ username });
    if (!user || !user.groupId) {
      bot.sendMessage(
        chatId,
        "You are not part of any group. Please join a group first."
      );
      return;
    }

    const group = await Group.findById(user.groupId);
    if (group) {
      if (group.members.length === 0) {
        bot.sendMessage(
          chatId,
          "No members in the group. Cannot calculate split."
        );
        return;
      }
      if (group.expenses.length === 0) {
        bot.sendMessage(chatId, "No expenses found for this group.");
        return;
      }
      const totalExpense = group.expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      const numMembers = group.members.length;
      const amountPerMember = totalExpense / numMembers;

      bot.sendMessage(
        chatId,
        `Each person needs to pay ₹ ${amountPerMember.toFixed(2)}.`
      );
    } else {
      bot.sendMessage(
        chatId,
        "Error: Group not found. Please try again later."
      );
    }
  } catch (error) {
    console.log("Error calculating split:", error);

    const errorMessage =
      "Oops! Something went wrong while calculating the split. Please try again later.";
    bot.sendMessage(chatId, errorMessage);
  }
};
