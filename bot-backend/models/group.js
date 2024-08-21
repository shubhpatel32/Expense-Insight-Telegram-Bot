const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: String,
    },
  ],
  expenses: [
    {
      amount: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      payer: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
