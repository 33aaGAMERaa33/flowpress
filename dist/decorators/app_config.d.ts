import { ClassConstructor } from "../defines/class_constructor";
import { ControllerImplicitImpl } from "../interfaces/controller.implicit.impl";
import { MiddlewareImplicitImpl } from "../interfaces/middleware.implicit.impl";
import { DataSource } from "typeorm";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { GlobalMiddlewareImpl } from "../interfaces/global_middleware.impl";
import { GlobalMiddlewareImplicitImpl } from "../interfaces/global_middleware.implicit.impl";
export declare function AppConfig<T>(data: {
    port: (instance: T) => number;
    databaseConfig?: ClassConstructor;
    modules?: ClassConstructor[];
    injectables?: ClassConstructor[];
    controllers?: ClassConstructor[];
    middlewares?: ClassConstructor<MiddlewareImpl>[];
    globalMiddlewares?: ClassConstructor<GlobalMiddlewareImpl>[];
}): <T_1 extends ClassConstructor>(constructor: T_1) => {
    new (...args: any[]): {
        [x: string]: any;
        readonly __port: number;
        __dataSource?: DataSource | undefined;
        __onLoaded?: Promise<void> | undefined;
        readonly __originalConstructor: ClassConstructor;
        readonly __controllers: ControllerImplicitImpl[];
        readonly __middlewares: MiddlewareImplicitImpl[];
        readonly __globalMiddlewares: GlobalMiddlewareImplicitImpl[];
    };
} & T_1;
