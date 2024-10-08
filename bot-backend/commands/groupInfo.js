const User = require("../models/user");
const Group = require("../models/group");

module.exports = async function groupInfo(bot, msg) {
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
      const membersList = group.members.join(", ");

      bot.sendMessage(
        chatId,
        `Current group: "${group.name}"\nID: "${user.groupId}"\nMembers: ${membersList}`
      );
    } else {
      bot.sendMessage(chatId, "Group not found.");
    }
  } catch (error) {
    console.log("Error in current status:", error);
    bot.sendMessage(
      chatId,
      "An error occurred while getting current status. Please try again later."
    );
  }
};
