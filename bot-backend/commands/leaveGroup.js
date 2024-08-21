const Group = require("../models/group");
const User = require("../models/user");

module.exports = async function leaveGroup(bot, msg) {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  try {
    // Find user's current group
    const user = await User.findOne({ username });
    if (!user || !user.groupId) {
      bot.sendMessage(chatId, "You are not part of any group.");
      return;
    }

    // Find the group and remove the user
    const group = await Group.findById(user.groupId);
    if (group) {
      // Remove user from group members
      group.members = group.members.filter((member) => member !== username);

      // Save the updated group
      await group.save();

      // Update user's groupId
      await User.findOneAndUpdate({ username }, { groupId: null });

      bot.sendMessage(chatId, "You have left the group.");

      // Optionally notify remaining members
      const remainingMembers = await User.find({
        username: { $in: group.members },
      });
      remainingMembers.forEach((member) => {
        bot.sendMessage(member.chatId, `${username} has left the group.`);
      });
    } else {
      bot.sendMessage(chatId, "Group not found.");
    }
  } catch (error) {
    console.log("Error in leaving group", error);
    bot.sendMessage(
      chatId,
      "An error occurred while leaving the group. Please try again later."
    );
  }
};
