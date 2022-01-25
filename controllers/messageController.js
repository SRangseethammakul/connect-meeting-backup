const config = require("../config/index");
exports.index = async (req, res, next) => {
  try {
    res.status(200).json({
      data: "rooms",
    });
  } catch (error) {
    next(error);
  }
};
exports.verifyWebHook = async (req, res) => {
  let VERIFY_TOKEN = config.VERIFY_TOKEN;
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log(challenge);
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};
