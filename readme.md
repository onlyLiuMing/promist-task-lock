# promise-task-lock

ps:

> 关于队列已经有[p-queue](https://github.com/sindresorhus/p-queue/tree/db1d98f880c16a458299a15255539635cbed0a00)这个库了，可以满足对于队列的大部分需求；

> 但是对于需要在 quque.add()返回原始函数（需要做回调传递，promise 的传递）这种需求并不满足，所以这里对 flyio 的功能进行了提取，仅仅对 ()=> promise<unknow> 的函数进行扩展（类似于高阶函数，由于我太菜了没找到合适的高阶函数的 ts 写法，所以目前用 class 进行实现），使用方式和原有方法相同，仅增加了 lock unlock clear [前（后）置钩子]的功能

## description

- 对 promise 任务扩展 lock 、 unlock 、 clear 方法
- 启发自 [flyio](https://github.com/wendux/fly) 中 对 request、response 的 lock 功能；在这里近提取出了对于 promise 扩展的 lock 、unlock 、clear 的功能（带有 preInterceptor,posInterctor 功能）

## used

- 具体使用方法参考 ./src/test.ts 文件中的写法

```typescript
import { PromiseLock } from "./index";
const newFetch = new PromiseLock<AxiosRequestConfig, AxiosResponse>(Fetch);
newFetch.lock(); // 锁定任务队列
newFetch.unlock(); // 解锁任务队列
newFetch.clear(); // 清空锁定的任务队列
newFetch.getLockStatus(); // 获取当前锁定状态
```
