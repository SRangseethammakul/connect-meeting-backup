const format = require("date-fns/format");
const config = require("../config/index");
const addMinutes = require("date-fns/addMinutes");
const parseISO = require("date-fns/parseISO");
const axios = require("axios");
const LINE_MESSAGING_API = "https://api.line.me/v2/bot/message";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.LINE}`,
};
const linePush = async (customerLineId, message) => {
  try {
    await axios({
      url: `${LINE_MESSAGING_API}/push`,
      headers: LINE_HEADER,
      method: "post",
      data: JSON.stringify({
        to: customerLineId,
        messages: Array.isArray(message) ? message : [message],
      }),
    });
  } catch (err) {
    console.log(err);
  }
};
async function cancelBooking(
  customerLineId,
  startDate,
  endDate,
  roomName,
  roomImage
) {
  let message = {
    type: "flex",
    altText: "การจองถูกยกเลิก",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: roomImage,
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
        action: {
          type: "uri",
          uri: "http://linecorp.com/",
        },
      },
      body: {
        type: "box",
        layout: "vertical",
        spacing: "md",
        contents: [
          {
            type: "text",
            text: `การจองห้อง ${roomName} ถูกยกเลิก`,
            wrap: true,
            weight: "bold",
            gravity: "center",
            size: "xl",
          },
          {
            type: "box",
            layout: "baseline",
            margin: "md",
            contents: [
              {
                type: "icon",
                size: "sm",
                url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              },
              {
                type: "icon",
                size: "sm",
                url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              },
              {
                type: "icon",
                size: "sm",
                url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              },
              {
                type: "icon",
                size: "sm",
                url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gold_star_28.png",
              },
              {
                type: "icon",
                size: "sm",
                url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/review_gray_star_28.png",
              },
              {
                type: "text",
                text: "4.0",
                size: "sm",
                color: "#999999",
                margin: "md",
                flex: 0,
              },
            ],
          },
          {
            type: "box",
            layout: "vertical",
            margin: "lg",
            spacing: "sm",
            contents: [
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "เริ่มต้น",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: startDate,
                    wrap: true,
                    size: "sm",
                    color: "#666666",
                    flex: 4,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "สิ้นสุด",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: endDate,
                    wrap: true,
                    size: "sm",
                    color: "#666666",
                    flex: 4,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Place",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: "7 Floor, No.3",
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 4,
                  },
                ],
              },
              {
                type: "box",
                layout: "baseline",
                spacing: "sm",
                contents: [
                  {
                    type: "text",
                    text: "Seats",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: "C Row, 18 Seat",
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 4,
                  },
                ],
              },
            ],
          },
          {
            type: "box",
            layout: "vertical",
            margin: "xxl",
            contents: [
              {
                type: "spacer",
              },
              {
                type: "image",
                url: "https://scdn.line-apps.com/n/channel_devcenter/img/fx/linecorp_code_withborder.png",
                aspectMode: "cover",
                size: "xl",
              },
              {
                type: "text",
                text: "You can enter the theater by using this code instead of a ticket",
                color: "#aaaaaa",
                wrap: true,
                margin: "xxl",
                size: "xs",
              },
            ],
          },
        ],
      },
    },
  };
  linePush(customerLineId, message);
  return true;
}
module.exports = {
  cancelBooking,
};
