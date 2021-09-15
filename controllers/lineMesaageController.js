const config = require("../config/index");
const { constantString, createNewCustomer } = require("../utils/nonUser");
const Customer = require("../models/customer");
const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const LINE_PROFILE_API = "https://api.line.me/v2/bot/profile";
const axios = require("axios");
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.LINE}`,
};
const reply = async (replyToken, message) => {
  try {
    await axios({
      url: `${LINE_MESSAGING_API}/reply`,
      headers: LINE_HEADER,
      method: "post",
      data: JSON.stringify({
        replyToken: replyToken,
        messages: Array.isArray(message) ? message : [message],
      }),
    });
  } catch (err) {
    console.log(err);
  }
};
const getUserProfile = async (userId) => {
  try {
    const resp = await axios({
      url: `${LINE_PROFILE_API}/${userId}`,
      headers: LINE_HEADER,
      method: "get",
    });
    return resp.data;
  } catch (err) {
    console.log(err);
  }
};
exports.index = async (req, res, next) => {
  res.status(200).json({ message: "Hello Company", data: `${config.LINE}` });
};

exports.responeAPI = async (req, res, next) => {
  if (req.method === "POST") {
    let event = req.body.events[0];
    const back = await getUserProfile(event.source.userId);
    const existuserId = await Customer.findOne({
      userId: event.source.userId,
    });
    // console.log(createNewCustomer(event.source.userId));
    let gettt = createNewCustomer(event.source.userId);
    console.log(constantString);
    console.log(gettt);
    let playback;
    if (!existuserId) {
      playback = gettt;
    }
    await reply(event.replyToken, playback);
  }
  res.status(200).json({ message: "Hello Company", data: "company" });
};
