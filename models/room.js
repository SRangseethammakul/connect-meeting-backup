const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    isUsed: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    img: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "rooms",
  }
);

const Room = mongoose.model("Room", schema);

module.exports = Room;
