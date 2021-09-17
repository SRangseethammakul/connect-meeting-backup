const Room = require("../models/room");
const format = require('date-fns/format');
async function getResponse() {
  let response = "";
  try {
    const rooms = await Room.find().where("isUsed").eq(true).sort({ _id: -1 });
    let res = await rooms.map((item) => ({
      imageUrl: item.image,
      action: {
        type: "postback",
        label: `เลือกห้อง ${item.name}`,
        data: `action=re&roomId=${item.id}`,
      },
    }));
    console.log(res);
    if (res.length) {
      response = {
        type: "template",
        altText: "จองเวลา",
        template: {
          type: "image_carousel",
          columns: res,
        },
      };
    } else {
      response = {
        type: "sticker",
        packageId: "6136",
        stickerId: "10551391",
      };
    }
  } catch (err) {
    console.log(err.message);
  }
  return response;
}
async function getAppointment() {
  let response = "";
  let result = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  if (true) {
    response = {
      type: "template",
      altText: "จองเวลา",
      template: {
        type: "buttons",
        thumbnailImageUrl: "https://www.aver.com/Upload/Expert/31/Main.jpg",
        imageAspectRatio: "rectangle",
        imageSize: "cover",
        imageBackgroundColor: "#FFFFFF",
        title: "จองเวลา",
        text: "กรุณาเลือกวันและเวลาที่ต้องการ",
        actions: [
          {
            type: "datetimepicker",
            label: "Select date",
            data: "from=appointment",
            mode: "datetime",
            initial: result,
            min: result,
          },
        ],
      },
    };
  }
  return response;
}
module.exports = {
  getResponse,
  getAppointment
};
