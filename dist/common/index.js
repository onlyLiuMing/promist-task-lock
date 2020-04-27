"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function type(input) {
    return Object.prototype.toString.call(input).slice(8, -1).toLowerCase();
}
exports.type = type;
function isObject(object, real = true) {
    if (real) {
        return type(object) === "object";
    }
    else {
        return object && typeof object === 'object';
    }
}
exports.isObject = isObject;
function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
}
exports.isFormData = isFormData;
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
}
exports.trim = trim;
function encode(val) {
    return encodeURIComponent(val)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/g, '$')
        .replace(/%2C/gi, ',')
        .replace(/%20/g, '+')
        .replace(/%5B/gi, '[')
        .replace(/%5D/gi, ']');
}
exports.encode = encode;
/**
 * 和encodeUrlComponent功能差不多
 * 格式化object为正常url参数
 * @param data
 */
function formatParams(data) {
    let str = "";
    let first = true;
    if (!isObject(data)) {
        return data;
    }
    function _encode(sub, path) {
        let subType = type(sub);
        if (subType == "array") {
            sub.forEach(function (e, i) {
                if (!isObject(e))
                    i = "";
                _encode(e, path + `%5B${i}%5D`);
            });
        }
        else if (subType == "object") {
            for (let key in sub) {
                if (path) {
                    _encode(sub[key], path + "%5B" + encode(key) + "%5D");
                }
                else {
                    _encode(sub[key], encode(key));
                }
            }
        }
        else {
            if (!first) {
                str += "&";
            }
            first = false;
            str += path + "=" + encode(sub);
        }
    }
    _encode(data, "");
    return str;
}
exports.formatParams = formatParams;
// Do not overwrite existing attributes
function merge(a, b, config) {
    for (let key in b) {
        if (!a.hasOwnProperty(key) || (config && config.overwrite)) {
            a[key] = b[key];
        }
        else if (isObject(b[key], true) && isObject(a[key], true)) {
            merge(a[key], b[key]);
        }
    }
    return a;
}
exports.merge = merge;
// 判断是否是promis
function isPromise(p) {
    // some  polyfill implementation of Promise may be not standard,
    // so, we test by duck-typing
    return p && p.then && p.catch;
}
exports.isPromise = isPromise;
// 函数合成
function compose(f, g) {
    return function (...args) {
        return f(g(args));
    };
}
exports.compose = compose;
;
