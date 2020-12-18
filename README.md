# UptimeRobot Telegram Bot

为UptimeRobot设计的一个第三方的Telegram通知中间件

## 关于这个项目

[UptimeRobot官方的Telegram Bot](https://t.me/officialuptimerobot) 真的很拉跨，所以就造了这个轮子。

推荐使用 [Cloudflare Workers](https://workers.cloudflare.com) 来部署

有三个变量建议使用环境变量来设置，当然直接硬编码进去也是没有问题的。

## 使用

直接新建一个Workers容器，复制app.js中所有的内容，粘贴进去即可。

### 环境变量

- BOT_TOKEN  : 您的Telegram Bot Token，可以向 [BotFather](https://t.me/BotFather) 申请
- CHAT_ID    : 消息发送至的用户/频道或是群组ID (使用 @name 或者 Unique ID)
- PASSWORD   : 为防止未授权发送操作，建议设置一个密码来保护。可选。

### UptimeRobot

1. 进入 `Dashboard` -> `MySettings`;
2. 创建一个类型为 `Webhook` 的通知;
3. 取一个好听的名字;
4. 把您的链接粘贴到 `URL to notify` 区域，最后记得加一个 '?' 英文问号;
5. 把如下的内容粘贴到 `POST Value (JSON Format)` 区域，记得修改您的密码：
    ``` json
    {
        "password": "您的密码",
        "monitorFriendlyName": "*monitorFriendlyName*",
        "alertType": "*alertType*",
        "alertDuration": "*alertDuration*"
    }
    ```
6. 勾选 `Send as JSON (application/json).` 以便于使用JSON格式发送数据。表单请求目前似乎问题比较严重。
7. `Create Alert Contact` ，之后关联您需要的节点即可。

## Author

Candinya

## License

MIT License
