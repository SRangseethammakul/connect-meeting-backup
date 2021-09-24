const Booking = require("../models/booking");
const {cancelBooking} = require('../utils/cancelBooking');
const parseISO = require("date-fns/parseISO");
const parse = require('date-fns/parse');
const format = require("date-fns/format");
exports.index = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name")
      .populate("room", "name")
      .select("-id")
      .sort({ _id: -1 });
    const bookingItems = await bookings.map((booking, index) => {
      return {
        title: booking.room.name,
        start: booking.bookingStart,
        end: booking.bookingEnd,
        extendedProps: {
          bookingId: booking._id,
          roomName: booking.room.name,
          customerName: booking.customer.name,
          startDate: booking.bookingStart,
          endDate: booking.bookingEnd,
        },
      };
    });
    res.status(200).json({
      data: bookingItems,
    });
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findOneAndRemove({ _id: id }).populate("customer", "userId").populate("room", "name image");
    let startDate = format(new Date(booking.bookingStart), 'MM/dd/yyyy H:m');
    let endDate = format(new Date(booking.bookingEnd), 'MM/dd/yyyy H:m');
    if (!booking) {
      throw new Error("ไม่สามารถลบข้อมูลได้");
    } else {
      console.log()
      await cancelBooking(booking.customer.userId, startDate, endDate, booking.room.name, booking.room.image);
      res.status(200).json({
        message: "deleted",
      });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "Error " + error.message,
      },
    });
  }
};
