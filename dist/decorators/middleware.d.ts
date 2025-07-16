import { ClassConstructor } from "../defines/class_constructor";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
export declare function Middelware<T extends ClassConstructor<MiddlewareImpl>>(constructor: T): T;
