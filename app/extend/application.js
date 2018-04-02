const assert = require('assert');
const _ctxSymbol = Symbol('Application#_ctx');

module.exports = {
    // this refer to application Object

    // redis session store
    get Store() {
        const app = this;
        const sessionConf = app.config.enhanceSession;

        class Store {
            constructor(sessionId, ctx) {
                assert(sessionId, 'sessionId is required in session store.');
                assert(ctx, 'ctx is required in session store.');
                this.sessionId = sessionId;
                this.id = `${sessionConf.prefix}${sessionId}`;
                this[_ctxSymbol] = ctx;
            }

            async sync() {
                let info = await this.get();

                Object.assign(this, info);
            }

            async set(key, value, maxAge = sessionConf.maxAge) {
                // TODO: check expire time
                await app.redis.hset(this.id, key, value);
                await app.redis.pexpire(this.id, maxAge);

                await this.sync();
                this[key] = value;

                return;
            }


            async setInfo(args) {
                // hmset
                let sets = [];

                await this.sync();
                for (let key in args) {
                    sets.push(key);
                    sets.push(args[key] || null);

                    this[key] = args[key] || null;
                }

                return await app.redis.hmset(this.id, sets);
            }

            async get(key) {
                // hget, hmget, hgetall

                // 这里使用中间变量转换三种兼容方式的返回异构
                let info = {};

                if (!key) {
                    // 没有传入key, 返回session完整信息
                    info = await app.redis.hgetall(this.id);

                } else if (Array.isArray(key)) {
                    // 传入key为数组, 返回session对应字段信息
                    let rs = await app.redis.hmget(this.id, key);

                    // [a, b, c] [1, 2, 3] merge
                    key.forEach((k, i) => {
                        info[k] = rs[i] || undefined;
                    });

                } else {
                    // 传入key为单一字段, 返回对应字段值
                    info[key] = this[key] || await app.redis.hget(this.id, key);

                }

                return info;
            }

            async destroy() {
                return sessionConf.delay ? await app.redis.expire(this.id, sessionConf.delay) : await app.redis.del(this.id);
            }

            async save(maxAge = sessionConf.maxAge) {
                await app.redis.pexpire(this.id, maxAge);

                let info = await this.get();
                let { sessionId, clientId } = info;
                sessionId && this[_ctxSymbol].cookies.set('sessionId', sessionId, {
                    maxAge,
                    overwrite: true
                });

                clientId && this[_ctxSymbol].cookies.set('clientId', clientId, {
                    maxAge,
                    overwrite: true
                });

                return;
            }
        }

        return Store;
    }
};
