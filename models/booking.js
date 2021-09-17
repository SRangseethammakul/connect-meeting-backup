const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    customer : {type : Schema.Types.ObjectId, ref : 'Customer'},
    room : {type : Schema.Types.ObjectId, ref : 'Room'},
    bookingStart: Date,
    bookingEnd: Date,
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "bookings",
  }
);

const Booking = mongoose.model("Booking", schema);

module.exports = Booking;
