'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.LINE_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const firstMessage = {
  "type": "bubble",
  "hero": {
    "type": "image",
    "url": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
    "size": "full",
    "aspectRatio": "20:13",
    "aspectMode": "cover",
    "action": {
      "type": "uri",
      "uri": "http://linecorp.com/"
    }
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "アンケート",
        "weight": "bold",
        "size": "xl"
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": "あなたはどちらに該当しますか？"
          }
        ]
      }
    ]
  },
  "footer": {
    "type": "box",
    "layout": "horizontal",
    "spacing": "sm",
    "contents": [
      {
        "type": "button",
        "style": "link",
        "height": "sm",
        "action": {
          "type": "postback",
          "label": "生徒",
          "data": "child"
        }
      },
      {
        "type": "button",
        "style": "link",
        "height": "sm",
        "action": {
          "type": "postback",
          "label": "保護者の方",
          "data": "parent"
        }
      },
      {
        "type": "spacer",
        "size": "sm"
      }
    ],
    "flex": 0
  }
}

// create LINE SDK client
const client = new line.Client(config);
//client.setDefaultRichMenu('richmenu-72cc81e2452e9682f50cfa5dacdcd9d5')

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  if (event.message.text == "アンケート"){
    //Flex messageで、JSONを送る？
    return client.replyMessage(event.replyToken, firstMessage);
  }else{

    // create a echoing text message
    let sum = 0
    let num = event.message.text.split('+');
    for (let i = 0; i < num.length; i++){
      sum += parseInt(num[i], 10);
    }

    const echo = { type: 'text', text: String(sum)};
    console.log(sum)
    // use reply API
    return client.replyMessage(event.replyToken, echo);
  }
}
// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
