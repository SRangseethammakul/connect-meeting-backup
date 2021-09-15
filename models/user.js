const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true, index: true },
    password: { type: String, required: true, trim: true, minlength: 8 },
    role: { type: String, default: "member" },
  },
  { collection: "users" }
);

schema.methods.encryPassword = async function (password) {
  const salt = await bcrypt.genSalt(5);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

schema.methods.checkPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);
  return isValid;
};

const user = mongoose.model("User", schema);

module.exports = user;