// 引擎
export type Engine<EnginePayload, EngineResultSturct> = (payload: EnginePayload) => Promise<EngineResultSturct>

// 拦截器
export interface Interceptor {
  lockPromise: Promise<any> | null | undefined;
  handler: InterceptorHandler<any, any>;
  onerror: (err: any) => any;
  lock: Function;
  unlock: Function;
  clear: Function;
}

// 拦截器-handler
export type InterceptorHandler<InputStruct, OutputStruct> = (val: InputStruct) => OutputStruct

// 前置拦截器
export interface PreInterceptor<InputStruct> extends Interceptor {
  handler: InterceptorHandler<any, InputStruct>;
}
// 后置拦截器
export interface PosInterceptor<InputStruct> extends Interceptor {
  handler: InterceptorHandler<InputStruct, any>;
}

export type PickOne<T, K extends keyof T> = T[K];