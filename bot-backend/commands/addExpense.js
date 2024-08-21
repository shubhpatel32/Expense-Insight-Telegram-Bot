const Group = require("../models/group");
const User = require("../models/user");

module.exports = async function addExpense(bot, msg, match) {
  const chatId = msg.chat.id;
  const amount = parseFloat(match[1]);
  const description = match[2];
  const username = msg.from.username;

  // Validate inputs

  try {
    if (isNaN(amount) || amount <= 0) {
      bot.sendMessage(
        chatId,
        "Error: Please provide a valid amount greater than zero."
      );
      return;
    }

    if (!description || description.trim() === "") {
      bot.sendMessage(
        chatId,
        "Error: Please provide a non-empty description for the expense."
      );
      return;
    }
    // Find user's current group
    const user = await User.findOne({ username });
    if (!user || !user.groupId) {
      bot.sendMessage(
        chatId,
        "You are not part of any group. Please join a group first."
      );
      return;
    }

    // Find the group and add expense
    const group = await Group.findById(user.groupId);
    if (group) {
      group.expenses.push({ amount, description, payer: username });
      await group.save();

      bot.sendMessage(
        chatId,
        `Expense of ₹${amount} added successfully: ${description}`
      );
    } else {
      bot.sendMessage(
        chatId,
        "Error: Group not found. Please try again later."
      );
    }
  } catch (error) {
    console.error("Error adding expense:", error); // Log error for debugging

    // Format and send error message to the user
    const errorMessage =
      "Oops! Something went wrong while adding the expense. Please try again later.";
    bot.sendMessage(chatId, errorMessage);
  }
};
