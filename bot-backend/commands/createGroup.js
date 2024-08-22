const Group = require("../models/group");
const User = require("../models/user");

module.exports = async function createGroup(bot, msg, match) {
  const chatId = msg.chat.id;
  const groupName = match[1];
  const username = msg.from.username;

  if (!groupName) {
    bot.sendMessage(
      chatId,
      "Please provide a group name. Usage: /creategroup [group_name]"
    );
    return;
  }

  try {
    const newGroup = new Group({
      name: groupName,
      members: [username],
      expenses: [],
    });
    await newGroup.save();

    let user = await User.findOne({ username });

    if (!user) {
      user = new User({ username, groupId: newGroup._id });
      await user.save();
    } else {
      if (user.groupId) {
        bot.sendMessage(
          chatId,
          "You are already a member of another group. Please leave your current group first using /leavegroup."
        );
        return;
      }
      await User.findOneAndUpdate({ username }, { groupId: newGroup._id });
    }

    bot.sendMessage(
      chatId,
      `Group "${groupName}" created successfully. Share this ID: "${newGroup._id}" with your friends to join the group.`
    );
  } catch (err) {
    console.log("Error creating group:", err);
    bot.sendMessage(
      chatId,
      "An error occurred while creating the group. Please try again later."
    );
  }
};
