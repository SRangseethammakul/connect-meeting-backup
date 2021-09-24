const config = require("../config/index");
const { createNewCustomer } = require("../utils/nonUser");
const { getResponse, getAppointment } = require("../utils/room");
const {
  appointmentStart,
  appintmentRoomSuccess,
  appointmentRoomEnd,
} = require("../utils/appointment");
const {
  reserveRoomSuccess,
  reserveRoom,
  reserveRoomEnd,
} = require("../utils/reserveRoom");
const parseISO = require("date-fns/parseISO");
const ObjectId = require("mongoose").Types.ObjectId;
const format = require("date-fns/format");
const Customer = require("../models/customer");
const Room = require("../models/room");
const Booking = require("../models/booking");
const { WebhookClient } = require("dialogflow-fulfillment");
const { Payload } = require("dialogflow-fulfillment");
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
            let checkRoomOverlap = await Booking.find({
              $or: [
                {
                  bookingStart: { $lt: endDate, $gte: startDate },
                },
                { bookingEnd: { $lte: endDate, $gt: startDate } },
              ],
            });
            let getRooms = await Room.find();
            let array1 = await getRooms.filter(function (n) {
              for (var i = 0; i < checkRoomOverlap.length; i++) {
                if (n.id == checkRoomOverlap[i].room) {
                  return false;
                }
              }
              return true;
            });
            let resultEndDateresAppointment = format(
              endDate,
              "yyyy-MM-dd'T'HH:mm"
            );
            let resultStartDateAppointment = format(
              startDate,
              "yyyy-MM-dd'T'HH:mm"
            );
            let resAppointment = await array1
              .filter((item) => item.status === true && item.isUsed === true)
              .map((item) => ({
                imageUrl: item.image,
                action: {
                  type: "postback",
                  label: `เลือกห้อง ${item.name}`,
                  data: `from=select&roomId=${item._id}&endDate=${resultEndDateresAppointment}&startDate=${resultStartDateAppointment}`,
                },
              }));
            payLoad = await appintmentRoomSuccess(
              resAppointment,
              resultEndDateresAppointment,
              resultStartDateAppointment
            );
          } else {
            if (checkRoomId[1] === "select&roomId") {
              console.log("appointment step 3");
              const [red, ...set] = event.postback.data.split("&");
              const room = await Room.findById(set[0].split("=")[1]);
              let newBooking = new Booking({
                customer: existuserId._id,
                room: room._id,
                bookingStart: parseISO(set[2].split("=")[1]),
                bookingEnd: parseISO(set[1].split("=")[1]),
              });
              await newBooking.save();
              payLoad = await appointmentRoomEnd(
                room,
                format(parseISO(set[2].split("=")[1]), "PPPP kk:mm"),
                format(parseISO(set[1].split("=")[1]), "PPPP kk:mm")
              );
            } else {
              let startDate = parseISO(event.postback.params.datetime);
              payLoad = await appointmentStart(event.postback, startDate);
            }
          }
        } else {
          if (event.postback.params) {
            let checkStartDate = event.postback.data;
            checkStartDate = checkStartDate.split("=");
            if (checkStartDate[3]) {
              let resultEndDate = parseISO(event.postback.params.datetime);
              resultStartDate = parseISO(checkStartDate[3]);
              const room = await Room.findById(checkRoomId[2].split("&")[0]);
              let checkRoomOverlap = await Booking.find({
                room: new ObjectId(room.id),
                $or: [
                  {
                    bookingStart: { $lt: resultEndDate, $gte: resultStartDate },
                  },
                  { bookingEnd: { $lte: resultEndDate, $gt: resultStartDate } },
                ],
              });
              if (checkRoomOverlap.length === 0) {
                const newBooking = new Booking({
                  customer: existuserId._id,
                  room: room.id,
                  bookingStart: resultStartDate,
                  bookingEnd: resultEndDate,
                });
                await newBooking.save();
              }
              payLoad = await reserveRoomSuccess(
                checkRoomOverlap,
                format(resultStartDate, "PPPP kk:mm"),
                format(resultEndDate, "PPPP kk:mm"),
                room
              );
            } else {
              result = parseISO(event.postback.params.datetime);
              const room = await Room.findById(checkRoomId[2]);
              payLoad = await reserveRoomEnd(room, event.postback.data, result);
            }
          } else {
            const room = await Room.findById(checkRoomId[2]);
            payLoad = await reserveRoom(room, event.postback.data);
          }
        }
        await reply(event.replyToken, payLoad);
      }
    }
  }
  res.status(200);
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
