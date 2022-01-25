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

exports.receive = async (req, res, next) => {
  try {
    console.log(req);
    const source = req.query.source;
    let body = req.body;
    let profileInfo,
      isNew = 0;
    if (body.object === "page") {
      body.entry.forEach(async function (entry) {
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        let senderUserid = webhook_event.sender.id;
        console.log(senderUserid);
      });
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error.message);
  }
};
