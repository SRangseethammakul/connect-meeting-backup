const format = require("date-fns/format");
const addMinutes = require("date-fns/addMinutes");
const parseISO = require("date-fns/parseISO");
const Booking = require("../models/booking");
async function appointmentStart(resultDate, startDateISO) {
  let newResultDate = addMinutes(startDateISO, 1);
  let newResult = format(newResultDate, "yyyy-MM-dd'T'HH:mm");
  startDateISO = format(startDateISO, "yyyy-MM-dd'T'HH:mm");
  console.log(newResult);
  let payLoad = {
    type: "flex",
    altText: "โปรดเลือกวันและเวลา",
    contents: {
      type: "bubble",
      hero: {
        type: "image",
        url: "https://www.aver.com/Upload/Expert/31/Main.jpg",
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
        contents: [
          {
            type: "text",
            text: `ห้องประชุม`,
            weight: "bold",
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
                    text: startDateISO,
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5,
                  },
                ],
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
                    text: "Place",
                    color: "#aaaaaa",
                    size: "sm",
                    flex: 1,
                  },
                  {
                    type: "text",
                    text: "Miraina Tower, 4-1-6 Shinjuku, Tokyo",
                    wrap: true,
                    color: "#666666",
                    size: "sm",
                    flex: 5,
                  },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        spacing: "sm",
        contents: [
          {
            type: "button",
            style: "link",
            height: "sm",
            action: {
              type: "datetimepicker",
              label: "จองวันและเวลาสิ้นสุด",
              data: `${resultDate.data}&dateStart=${startDateISO}`,
              mode: "datetime",
              initial: newResult,
              min: newResult,
            },
          },
          {
            type: "spacer",
            size: "sm",
          },
        ],
        flex: 0,
      },
    },
  };
  return payLoad;
}
async function appintmentRoomSuccess(res,resultEndDate, resultStartDate) {
  let response = '';
  if (res.length) {
    response = {
      type: "template",
      altText: "เลือกห้อง",
      template: {
        type: "image_carousel",
        columns: res,
      },
    };
  } else {
    response = [{
      type : "text",
      "text": "ไม่มีห้องว่าง"
    },{
      type: "sticker",
      packageId: "6136",
      stickerId: "10551391",
    }];
  }
  return response;
}
async function appointmentRoomEnd(room, startDate, endDate) {
  try {
    let payLoad = {
      type: "flex",
      altText: "ข้อมูล",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: room.image,
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
              text: room.name,
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
    return payLoad;
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = {
    appintmentRoomSuccess,
    appointmentStart,
    appointmentRoomEnd
  }