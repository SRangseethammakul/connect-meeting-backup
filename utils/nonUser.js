// named exports on separate LOC
const constantString = [
  {
    type: "flex",
    altText: "สมัครใช้งาน",
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "horizontal",
            contents: [
              {
                type: "image",
                url: "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip4.jpg",
                size: "full",
                aspectMode: "cover",
                aspectRatio: "150:196",
                gravity: "center",
                flex: 1,
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "image",
                    url: "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip5.jpg",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "150:98",
                    gravity: "center",
                  },
                  {
                    type: "image",
                    url: "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip6.jpg",
                    size: "full",
                    aspectMode: "cover",
                    aspectRatio: "150:98",
                    gravity: "center",
                  },
                ],
                flex: 1,
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: "NEW",
                    size: "xs",
                    color: "#ffffff",
                    align: "center",
                    gravity: "center",
                  },
                ],
                backgroundColor: "#EC3D44",
                paddingAll: "2px",
                paddingStart: "4px",
                paddingEnd: "4px",
                flex: 0,
                position: "absolute",
                offsetStart: "18px",
                offsetTop: "18px",
                cornerRadius: "100px",
                width: "48px",
                height: "25px",
              },
            ],
          },
        ],
        paddingAll: "0px",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "text",
                    contents: [],
                    size: "xl",
                    wrap: true,
                    text: "คุณยังไม่ได้ทำการลงทะเบียน",
                    color: "#ffffff",
                    weight: "bold",
                  },
                  {
                    type: "text",
                    text: "กรุณาลงทะเบียน",
                    color: "#ffffffcc",
                    size: "sm",
                  },
                ],
                spacing: "sm",
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "button",
                    action: {
                      type: "uri",
                      label: "ลงทะเบียน",
                      uri: "https://srangseethammakul.github.io/ihealth/",
                    },
                    style: "primary",
                  },
                ],
                paddingAll: "13px",
                backgroundColor: "#ffffff1A",
                cornerRadius: "2px",
                margin: "xl",
              },
            ],
          },
        ],
        paddingAll: "20px",
        backgroundColor: "#464F69",
      },
    },
  },
];

const createNewCustomer = (userId) => {
  const response = [
    {
      type: "flex",
      altText: "this is a flex message",
      contents: {
        type: "bubble",
        header: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "horizontal",
              contents: [
                {
                  type: "image",
                  url: "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip4.jpg",
                  size: "full",
                  aspectMode: "cover",
                  aspectRatio: "150:196",
                  gravity: "center",
                  flex: 1,
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "image",
                      url: "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip5.jpg",
                      size: "full",
                      aspectMode: "cover",
                      aspectRatio: "150:98",
                      gravity: "center",
                    },
                    {
                      type: "image",
                      url: "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip6.jpg",
                      size: "full",
                      aspectMode: "cover",
                      aspectRatio: "150:98",
                      gravity: "center",
                    },
                  ],
                  flex: 1,
                },
                {
                  type: "box",
                  layout: "horizontal",
                  contents: [
                    {
                      type: "text",
                      text: "NEW",
                      size: "xs",
                      color: "#ffffff",
                      align: "center",
                      gravity: "center",
                    },
                  ],
                  backgroundColor: "#EC3D44",
                  paddingAll: "2px",
                  paddingStart: "4px",
                  paddingEnd: "4px",
                  flex: 0,
                  position: "absolute",
                  offsetStart: "18px",
                  offsetTop: "18px",
                  cornerRadius: "100px",
                  width: "48px",
                  height: "25px",
                },
              ],
            },
          ],
          paddingAll: "0px",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "text",
                      contents: [],
                      size: "xl",
                      wrap: true,
                      text: "คุณยังไม่ได้ทำการลงทะเบียน",
                      color: "#ffffff",
                      weight: "bold",
                    },
                    {
                      type: "text",
                      text: "กรุณาลงทะเบียน",
                      color: "#ffffffcc",
                      size: "sm",
                    },
                  ],
                  spacing: "sm",
                },
                {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "button",
                      action: {
                        type: "uri",
                        label: `ลงทะเบียน`,
                        uri: `https://connect-meeting-frontend.netlify.app/customer?userid=${userId}`,
                      },
                      style: "primary",
                    },
                  ],
                  paddingAll: "13px",
                  // backgroundColor: "#ffffff1A",
                  cornerRadius: "2px",
                  margin: "xl",
                },
              ],
            },
          ],
          paddingAll: "20px",
          backgroundColor: "#464F69",
        },
      },
    },
  ];
  return response;
};
module.exports = {
  createNewCustomer: createNewCustomer,
  constantString: constantString,
};
