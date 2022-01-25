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
        if (webhook_event.postback) {
          console.log(webhook_event.postback.payload);
        }
        if (
          webhook_event.message !== undefined &&
          !webhook_event.message.is_echo
        ) {
          let messageArray = [];
          if (webhook_event.message.attachments) {
            for (const content of webhook_event.message.attachments) {
              switch (content.type) {
                case "video":
                  await uploadImageToS3(
                    content.payload.url,
                    `${source}/facebook/content/${senderUserid}/${uuidv4()}.mp4`
                  );
                  messageArray.push({
                    type: "video",
                    content: `${source}/facebook/content/${senderUserid}/${uuidv4()}.mp4`,
                  });
                  break;
                case "image":
                  await uploadImageToS3(
                    content.payload.url,
                    `${source}/facebook/content/${senderUserid}/${uuidv4()}.JPEG`
                  );
                  messageArray.push({
                    type: "image",
                    content: `${source}/facebook/content/${senderUserid}/${uuidv4()}.JPEG`,
                  });
                  break;
                default:
                  text = "Looking forward to the Weekend";
              }
            }
          } else {
            if (webhook_event.message.text.toLowerCase().trim() === "new") {
              if (!isNew) {
                let chatHistory = await getChatMessage(senderUserid);
                if (!chatHistory.data) {
                }
                isNew = 1;
                console.log(isNew);
                const profile = await getUserProfile(senderUserid);
                await uploadImageToS3(
                  profile.profile_pic,
                  `${source}/facebook/profile/${senderUserid}.JPEG`
                );
                profileInfo = {
                  licenseId: senderUserid,
                  displayName: `${profile.first_name} ${profile.last_name}`,
                  pathImage: `${source}/facebook/profile/${senderUserid}.JPEG`,
                };
              }
            }
            messageArray.push({
              type: "text",
              content: `${webhook_event.message.text}`,
            });
          }
          for (const item of messageArray) {
            await sendContent(
              item.type,
              item.content,
              item,
              senderUserid,
              webhook_event.message.mid,
              "facebook",
              isNew,
              profileInfo
            );
          }
        }
      });
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error.message);
  }
};
