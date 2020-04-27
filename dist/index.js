"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
// 默认值
const defaultIntersceptorHandler = (val) => val;
const defaultIntersceptorOnerror = (err) => console.error(err);
const defaultIntercsceptor = {
    handler: defaultIntersceptorHandler,
    onerror: defaultIntersceptorOnerror,
    lockPromise: null,
    lock: () => { console.info('invalid lock'); },
    unlock: () => { console.info('invalid unlock'); },
    clear: () => { console.info('invalid clear'); },
};
/**
 * promise-lock
 * ·启发自flyio.js, flyio本身带有lock，unlock，useInterceptor方法，不过不够通用，这里就给抽离出来了，用于桥接各种promise的方法（例如axios、fetch等，目前也没想到其他哪里可以用到这个东西）·
 * @description 为生成promise的方法，挂载lock、unlock方法，控制任务队列
 * @example
 * ```typescript
 *    const newAxios = new PromiseLock(axios);
 *    newAxios({ ...[axios config] }) //  newAxios 等同于 axios 方法，只是多了 unlock、lock、setInterceptor的功能
 * ```
 */
class PromiseLock {
    constructor(engine) {
        // 默认引擎
        this.ENGINE = (val) => Promise.resolve(val);
        // 默认拦截器
        this.interceptor = {
            preInterceptor: { ...defaultIntercsceptor },
            posInterceptor: { ...defaultIntercsceptor } // 这里defaultIntercsceptor只是一层数据，内部没有object类型，无需深拷贝
        };
        this.getLockStatus = () => Boolean(this.interceptor.preInterceptor.lockPromise); // 语法糖-获取“前置锁”锁定状态
        Boolean(engine) && (this.ENGINE = engine);
        this.wrapLock(this.interceptor.preInterceptor); // 设置前置锁
        this.wrapLock(this.interceptor.posInterceptor); // 设置后置锁
        this.lock = this.interceptor.preInterceptor.lock;
        this.unlock = this.interceptor.preInterceptor.unlock;
        this.clear = this.interceptor.preInterceptor.clear;
    }
    /**
     * Add  lock/unlock API for interceptor.
     *
     * Once an request/response interceptor is locked, the incoming request/response
     * will be added to a queue before they enter the interceptor, they will not be
     * continued  until the interceptor is unlocked.
     *
     * @param [interceptor] either is interceptors.request or interceptors.response
     */
    wrapLock(interceptor) {
        let resolve;
        let reject;
        function _clear() {
            interceptor.lockPromise = resolve = reject = null;
        }
        common_1.merge(interceptor, {
            lock() {
                if (!resolve) {
                    interceptor.lockPromise = new Promise((_resolve, _reject) => {
                        resolve = _resolve;
                        reject = _reject;
                    });
                }
            },
            unlock() {
                if (resolve) {
                    resolve();
                    _clear();
                }
            },
            clear() {
                if (reject) {
                    reject("cancel");
                    _clear();
                }
            },
            getLockStatus() {
                return interceptor.lockPromise && interceptor.lockPromise.then;
            }
        }, { overwrite: true });
    }
    /**
     * 设置拦截器
     * @param type 拦截器类型
     * @param interceptor 拦截器本身
     */
    setIntercaption(type, interceptor) {
        let interceptorType = 'preInterceptor';
        switch (type) {
            case 'pre_position':
                interceptorType = 'preInterceptor';
                break;
            case 'post_position':
                interceptorType = 'posInterceptor';
                break;
        }
        if (interceptor) {
            this.interceptor[interceptorType].handler = interceptor;
        }
        else {
            this.interceptor[interceptorType].handler = defaultIntersceptorHandler;
        }
    }
    /**
     * 如果“拦截器被锁定（存在 “promise锁”）”则将后进入的挂载到“promise锁”的then方法上
     * 不存在“promise锁”时，直接执行回调函数
     * @param [promise] if the promise exist, means the interceptor is  locked.
     * @param [callback]
     */
    enqueueIfLocked(interceptorLock, callback) {
        if (interceptorLock) {
            interceptorLock.then((val) => {
                callback(val);
            });
        }
        else {
            callback();
        }
    }
    // 返回结果（检测“后置callback”的执行情况）
    onresult(result, inputPayload, isError = false) {
        const posInterceptor = this.interceptor.posInterceptor;
        return new Promise((resolve, reject) => {
            this.enqueueIfLocked(posInterceptor.lockPromise, () => {
                Promise.resolve(posInterceptor.handler.call(posInterceptor, result))
                    .then(val => {
                    if (isError) {
                        reject(Object.assign({}, { result: result, __engineInput: inputPayload }));
                    }
                    else {
                        resolve(val);
                    }
                });
            });
        });
    }
    onError(error, inputPayload) {
        return this.onresult(error, inputPayload, true);
    }
    // 启动 engine 方法
    start(args) {
        const inputPayload = args;
        const preInterceptor = this.interceptor.preInterceptor;
        return new Promise((startResolve, startReject) => {
            this.enqueueIfLocked(preInterceptor.lockPromise, () => {
                // 每一步都返回一个promise: "前置callback" -> “引擎” -> “后置回调”
                return Promise.resolve(preInterceptor.handler.call(preInterceptor, inputPayload))
                    .then((inptEnginePayload) => {
                    // 启动引擎方法
                    return this.ENGINE(inptEnginePayload)
                        .then(engineOutput => {
                        // 引擎完成后，结束start的promise
                        startResolve(this.onresult(engineOutput));
                    });
                })
                    .catch(err => {
                    // Engine发生错误后，reject start的promise
                    startReject(err);
                });
            });
        }).catch(err => {
            return this.onError(err, inputPayload);
        });
    }
}
exports.PromiseLock = PromiseLock;
