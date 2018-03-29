/*
* 安全性设定为
* SID和CID都与SK和divisor相关
* SID和CID相关
*
* 防止SID和CID伪造, 以及SID和CID不匹配
* */

const randomOf = require('random-of');
const crypto = require('crypto');

module.exports = (config, app) => {
    // 计算多个字符串与sk的sha1, 并进行求余
    const countVcode = (str, CID = '') => {
        let { sk, divisor } = config;

        let hash = crypto.createHash('sha1').update(`${sk}${str}${CID}`).digest('hex');

        return parseInt(hash, 16) % divisor;
    };

    // 返回36进制时间戳
    const timestamp36 = () => {
        return Date.now().toString(36);
    };

    // 创建一个client id
    // 由两部份组成,
    // 第一部份为32位16进制随机值加36进制时间戳组成的1d,
    // 第二部份为hash求余的验证值.
    const generateCID = () => {
        const charset = '0123456789abcdef';

        let id = `${randomOf.getStrLimit(32, charset)}${timestamp36()}`;
        let vcode = countVcode(id);

        return `${id}-${vcode}`;
    };

    // 创建一个session id
    // 由中杠分隔的两部份组成:
    // 第一部份为 s开头的加16位随机字符串再加上36进制时间戳的id
    // 第二部份为hash求余产生的验证值.
    const generateSID = (CID) => {
        if (!CID) {
            return '';
        }
        let id = `s${randomOf.getStr(16)}${timestamp36()}`;
        let vcode = countVcode(id, CID);

        return `${id}-${vcode}`;
    };

    // 创建requestId, 生成规则为中杠"-"分隔的三段字符串,
    // 第一段为几个固定值 Q 表示正常的请求,
    // 第二段为10个长度的随机字符串.
    // 第三段为请求时间的36进制表示字符串
    const generateREQID = () => {
        return `Q-${randomOf.getStr(10)}-${timestamp36()}`.toUpperCase();
    };

    return async function enhanceSession(ctx, next) {
        let Store = ctx.app.Store;

        let clientId = ctx.cookies.get('clientId');
        let sessionId = ctx.cookies.get('sessionId');

        if (clientId && sessionId) {
            // clientId sessionId 两个都存在才认为是真实的session
            // TODO: 后续做格式校验及SID, CID关联性校验

            ctx.session = new Store(sessionId, ctx);
            ctx.session.setInfo({
                clientId,
                sessionId
            });

        } else {
            // clientId sessionId 任意一个不存在则一并生成新的
            clientId = generateCID();
            sessionId = generateSID(clientId);

            // TODO: 后续做格式校验及SID, CID关联性校验

            ctx.session = new Store(sessionId, ctx);

            ctx.session.setInfo({
                sessionId,
                clientId
            });

            let requestId = generateREQID();

            ctx.set('x-request-id', requestId);
            ctx.set('x-session-id', sessionId);
            ctx.cookies.set('sessionId', sessionId, config);
            ctx.cookies.set('clientId', clientId, config);

            ctx.app.logger.info(`[middle:enhanceSession] set new clientId: ${clientId}`);
            ctx.app.logger.info(`[middle:enhanceSession] set new sessionId: ${sessionId}`);
            ctx.app.logger.info(`[middle:enhanceSession] requestId: ${requestId}`);
        }

        // session保活
        // TODO: 后续考虑延迟保活时间
        await ctx.session.save();

        await next();
    };
};
