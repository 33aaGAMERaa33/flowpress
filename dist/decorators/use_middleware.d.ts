import { ClassConstructor } from "../defines/class_constructor";
export type RoutesMiddlewares = Record<string | symbol, ClassConstructor[]>;
export declare function UseMiddleware<T extends ClassConstructor>(middlewareConstructor: T): MethodDecorator;
