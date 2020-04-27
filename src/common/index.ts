export function type(input: any) {
  return Object.prototype.toString.call(input).slice(8, -1).toLowerCase()
}

export function isObject(object: any, real: boolean = true) {
  if (real) {
    return type(object) === "object"
  } else {
    return object && typeof object === 'object'
  }
}

export function isFormData(val: any) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

export function trim(str: string) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

export function encode(val: string) {
  return encodeURIComponent(val)
    .replace(/%40/gi, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

/**
 * 和encodeUrlComponent功能差不多
 * 格式化object为正常url参数
 * @param data 
 */
export function formatParams(data: any): string {
  let str = "";
  let first = true;
  if (!isObject(data)) {
    return data;
  }

  function _encode(sub: any, path: string) {
    let subType = type(sub);
    if (subType == "array") {
      sub.forEach(function (e: string, i: any) {
        if (!isObject(e)) i = "";
        _encode(e, path + `%5B${i}%5D`);
      });
    } else if (subType == "object") {
      for (let key in sub) {
        if (path) {
          _encode(sub[key], path + "%5B" + encode(key) + "%5D");
        } else {
          _encode(sub[key], encode(key));
        }
      }
    } else {
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

// Do not overwrite existing attributes
export function merge<T>(a: any, b: { [key: string]: any }, config?: { overwrite: boolean }): T {
  for (let key in b) {
    if (!a.hasOwnProperty(key) || (config && config.overwrite)) {
      a[key] = b[key];
    } else if (isObject(b[key], true) && isObject(a[key], true)) {
      merge(a[key], b[key])
    }
  }
  return a;
}

// 判断是否是promis
export function isPromise(p: any) {
  // some  polyfill implementation of Promise may be not standard,
  // so, we test by duck-typing
  return p && p.then && p.catch;
}


// 函数合成
export function compose(f: Function, g: Function) {
  return function (...args: any[]) {
    return f(g(args));
  };
};
