import { ClassConstructor } from "../defines/class_constructor";
import { BaseMiddlewareImpl } from "../interfaces/base_middleware.impl";
export declare function Middleware<T extends ClassConstructor<BaseMiddlewareImpl>>(constructor: T): T;
