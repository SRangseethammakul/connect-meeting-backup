const config = require("../config/index");
const { createNewCustomer } = require("../utils/nonUser");
const { getResponse } = require("../utils/room");
const { appintmentRoomEnd } = require("../utils/appointment");
const {
  reserveRoomSuccess,
  reserveRoom,
  reserveRoomEnd,
} = require("../utils/reserveRoom");
const Customer = require("../models/customer");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Card, Suggestion, Payload } = require("dialogflow-fulfillment");
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
const postToDialogflow = async (payloadRequest) => {
  console.log(config.DIALOGFLOW);
  payloadRequest.headers.host = "dialogflow.cloud.google.com";
  await axios({
    url: config.DIALOGFLOW,
    headers: payloadRequest.headers,
    method: "post",
    data: payloadRequest.body,
  });
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

exports.responeMiddle = async (req, res, next) => {
  if (req.method === "POST") {
    let event = req.body.events[0];
    const existuserId = await Customer.findOne({
      userId: event.source.userId,
    });
    let playback;
    if (!existuserId) {
      playback = createNewCustomer(event.source.userId);
      await reply(event.replyToken, playback);
    } else {
      if (event.type === "message" && event.message.type === "text") {
        postToDialogflow(req);
      } else if (event.type === "postback") {
        let result = "";
        let payLoad = "";
        let resultStartDate = "";
        let checkRoomId = event.postback.data;
        checkRoomId = checkRoomId.split("=");
        if (checkRoomId[0] === "from") {
          if (checkRoomId[1] === "appointment&dateStart") {
            const { data, params } = event.postback;
            const dateStart = data.split("=");
            let startDate = parseISO(dateStart[2]);
            let endDate = parseISO(params.datetime);
            payLoad = await appintmentRoomSuccess(endDate, startDate);
          } else {
            if (checkRoomId[1] === "select&roomId") {
              payLoad = await appointmentRoomEnd(
                event.postback.data,
                event.source.userId
              );
            } else {
              let startDate = parseISO(event.postback.params.datetime);
              payLoad = await appintmentRoomEnd(event.postback, startDate);
            }
          }
        } else {
          if (event.postback.params) {
            let checkStartDate = event.postback.data;
            checkStartDate = checkStartDate.split("=");
            if (checkStartDate[3]) {
              let resultEndDate = parseISO(event.postback.params.datetime);
              resultStartDate = parseISO(checkStartDate[3]);
              payLoad = await reserveRoomSuccess(
                checkRoomId[2].split("&")[0],
                resultEndDate,
                resultStartDate,
                event.source.userId
              );
            } else {
              result = parseISO(event.postback.params.datetime);
              payLoad = await reserveRoomEnd(
                checkRoomId[2],
                event.postback.data,
                result
              );
            }
          } else {
            console.log(event.postback.data);
            payLoad = await reserveRoom(checkRoomId[2], event.postback.data);
          }
        }

        // await reply(event.replyToken, payLoad);
        console.log(payLoad);
      }
    }
  }
  res.status(200).json({ message: "Hello Company", data: "company" });
};
exports.dialogflow = async (req, res, next) => {
  const agent = new WebhookClient({
    request: req,
    response: res,
  });
  async function welcome(agent) {
    try {
      console.log(
        "---------------------line welcome---------------------------"
      );
      let payloadJson = await getResponse();
      console.log(payloadJson);
      let messageText =
        payloadJson.type === "sticker"
          ? "ห้องถูกจองเต็มหมดแล้วครับ"
          : "เลือกห้องต่อไปนี้";
      let payload = new Payload("LINE", payloadJson, {
        sendAsMessage: true,
      });
      agent.add(messageText);
      agent.add(payload);
    } catch (error) {
      console.error(error);
    }
  }
  async function appointment(agent) {
    try {
      console.log(
        "---------------------line welcome appointment---------------------------"
      );
      let payloadJson = await getAppointment();
      console.log(payloadJson);
      let messageText = "เลือกวันและเวลาที่ต้องการ";
      let payload = new Payload("LINE", payloadJson, {
        sendAsMessage: true,
      });
      agent.add(messageText);
      agent.add(payload);
    } catch (error) {
      console.error(error);
    }
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Reserve time", welcome);
  intentMap.set("appointment", appointment);
  agent.handleRequest(intentMap);
};
