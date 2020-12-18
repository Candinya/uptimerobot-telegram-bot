const password   = typeof PASSWORD  !== 'undefined' ? PASSWORD  : ""; // 请求的密码，防止恶意请求，可以留空
const tgBotToken = typeof BOT_TOKEN !== 'undefined' ? BOT_TOKEN : ""; // Telegram Bot Token，可以向BotFather申请
const tgChatId   = typeof CHAT_ID   !== 'undefined' ? CHAT_ID   : ""; // Telegram Chat ID，用@或是数值的方式来传递均可

addEventListener("fetch", (e) => {
    if (e.request.method === "POST") {
        return e.respondWith(handleRequest(e.request)); // 处理消息
    } else {
         // 错误返回
        return e.respondWith(new Response("不对不对不对，怎么想都应该是POST操作吧！", { status: 418 }));
    }
});

/**
 * 检测密码是否正确
 * @param {String} reqpass 请求的密码
 */
const verifyPassword = (reqpass) => {
    if (password && reqpass && reqpass == password) { 
        // 有密码且正确
        return true;
    } else if (!password) { 
        // 无密码，则无视传入的密码请求
        return true;
    } else { 
        // 有密码但不正确
        return false;
    }
}

/**
 * 处理请求消息，无论是application/json还是application/x-www-form-urlencoded都可以处理。
 * @param {Request} req 请求的数据
 */
const handleRequest = async (request) => {
    const { headers } = request;
    const contentType = headers.get("content-type") || "";
    let password, serverName, eventType, eventDuration;

    if (contentType.includes("application/json")) {
        const data = await request.json();
        password      = data.password;
        serverName    = data.monitorFriendlyName;
        eventType     = data.alertType;
        eventDuration = data.alertDuration;
    } else if (contentType.includes("form")) {
        const data = await request.formData();
        password      = data['password'];
        serverName    = data['monitorFriendlyName'];
        eventType     = data['alertType'];
        eventDuration = data['alertDuration'];
    }
  
    if (verifyPassword(password)) {
        // 发送服务器数据
        const sendData = await sendEventMsg(serverName, eventType, eventDuration);
        return sendData;
    } else {
        // 密码错误，拒绝请求
        return new Response("密码不正确，请求被拒绝。", { status: 403 });
    }
}

/**
 * 将经过的时间（秒）调整成用户友好的字符串
 * @param {Number} tsec 秒
 */
const getTimeString = (tsec) => {

    const dt = new Date(tsec * 1000);

    let timeStr = '';
    const hours = dt.getUTCHours();
    const minutes = dt.getUTCMinutes();
    const seconds = dt.getUTCSeconds();
    if (hours) {
        timeStr += hours + '小时';
    }
    if (minutes) {
        timeStr += minutes + '分钟';
    }
    if (seconds) {
        timeStr += minutes + '秒';
    }
    return timeStr;
};

/**
 * 发送消息
 * @param {String} serverName 服务器名
 * @param {Number} eventType 事件名
 * @param {Number} eventDuration 持续时间(s)
 */
const sendEventMsg = async (serverName, eventType, eventDuration) => {
    if (!tgBotToken || !tgChatId) {
        // 配置未完成
        return;
    }

    const botApi = `https://api.telegram.org/bot${tgBotToken}/sendMessage`;
    let info;
    
    // 准备消息
    switch (eventType) {
        // 1: down, 2: up, 3: SSL expiry notification
        case 1: // Boom!
            info = `坏耶，*${serverName}*出问题了欸...`;
            break;
        case 2: // 恢复
            info = `好耶，经过 _${getTimeString(eventDuration)}_ 的维护， *${serverName}* 恢复上线啦～`;
            break;
        case 3: // 证书过期
            info = `要注意哦，*${serverName}*的证书过期啦..`;
            break;
        default: // 错误
            info = `出现了一个异常的请求类型**${eventType}**，是什么新的特性吗？`;
            break;
    }

    // 准备发送
    const data = {
        chat_id: tgChatId,
        text: info,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true
    };

    // 发送消息
    const result = await fetch(botApi, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });
    if (result.ok) {
        return new Response('发送成功~');
    } else {
        return result;
    }
};