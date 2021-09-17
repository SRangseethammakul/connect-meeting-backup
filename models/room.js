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
    image : {type : String, default : 'nopic.png'},
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "rooms",
  }
);

const Room = mongoose.model("Room", schema);

module.exports = Room;
