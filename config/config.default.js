'use strict';

/**
 * egg-enhance-session default config
 * @member Config#enhanceSession
 * @property {String} SOME_KEY - some description
 */
exports.enhanceSession = {
    // 以下支持koa-session所有可定义字段, sessionStore和ContextStore除外
    //cookie key
    keys: 'key1, key2',

    // 2 小时, expire time
    maxAge: 2 * 3600 * 1000,

    // 以下为enhanceSession自定义字段
    // CID 和 SID 生成校验的sk
    sk: 'default security key for cookie send.',

    // CID 和 SID 校验位
    divisor: 3412,

    // session store id prefix
    prefix: 'session#',

    // session expire delay, in seconds
    delay: 0
};

exports.redis = {
    client: {
        host: '127.0.0.1',
        port: 6379,
        password: null,
        db: 0,
    },
};
