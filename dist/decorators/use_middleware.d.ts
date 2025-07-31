import { ClassConstructor } from "../defines/class_constructor";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
export type RoutesMiddlewares = Record<string | symbol, ClassConstructor[]>;
export declare function UseMiddleware<T extends ClassConstructor<MiddlewareImpl>>(middlewareConstructor: T): MethodDecorator;
