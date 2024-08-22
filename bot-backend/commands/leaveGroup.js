const Group = require("../models/group");
const User = require("../models/user");

module.exports = async function leaveGroup(bot, msg) {
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
      group.members = group.members.filter((member) => member !== username);

      await group.save();

      await User.findOneAndUpdate({ username }, { groupId: null });

      bot.sendMessage(chatId, "You have left the group.");

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
