const mongoose = require("mongoose");
const schema = new mongoose.Schema(
  {
    customer: {
      type: String,
      require: true,
      trim: true,
    },
    name: {
      type: String,
      require: true,
      trim: true,
    },
    numberPhone: {
      type: String,
      require: true,
      trim: true,
    },
    department: {
      type: String,
      require: true,
      trim: true,
    },
    isUsed: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: "customers",
  }
);

const Customer = mongoose.model("Customer", schema);

module.exports = Customer;
