const Group = require("../models/group");
const User = require("../models/user");

module.exports = async function joinGroup(bot, msg, match) {
  const chatId = msg.chat.id;
  const groupId = match[1];
  const username = msg.from.username;

  if (!groupId) {
    bot.sendMessage(
      chatId,
      "Please provide the group ID. Usage: /joingroup [group_id]"
    );
    return;
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      if (existingUser.groupId) {
        bot.sendMessage(
          chatId,
          "You are already part of a group. Leave the current group using /leavegroup before joining another."
        );
        return;
      }

      existingUser.groupId = groupId;
      await existingUser.save();
    } else {
      const newUser = new User({ username, groupId });
      await newUser.save();
    }

    const group = await Group.findById(groupId);
    if (group) {
      if (!group.members.includes(username)) {
        group.members.push(username);
        await group.save();
        bot.sendMessage(
          chatId,
          `Joined group "${group.name}" id: "${groupId}"`
        );
      } else {
        bot.sendMessage(chatId, "You are already a member of this group.");
      }
    } else {
      bot.sendMessage(chatId, "Group not found.");
    }
  } catch (error) {
    console.log("Error in joining group", error);
    bot.sendMessage(
      chatId,
      "An error occurred while joining the group. Please try again later."
    );
  }
};
