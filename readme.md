# promise-task-lock

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
