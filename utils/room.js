const Room = require("../models/room");
async function getResponse() {
  let response = "";
  try {
    const rooms = await Room.find()
      .where("isUsed")
      .eq(true)
      .sort({ _id: -1 });
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
module.exports = {
  getResponse,
};
