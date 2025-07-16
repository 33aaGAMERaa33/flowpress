import { ClassConstructor } from "../defines/class_constructor";
import { ControllerImplicitImpl } from "../interfaces/controller.implicit.impl";
import { MiddlewareImplicitImpl } from "../interfaces/middleware.implicit.impl";
import { DataSource } from "typeorm";
export declare function AppConfig<T>(data: {
    port: (instance: T) => number;
    databaseConfig?: ClassConstructor;
    modules?: ClassConstructor[];
    injectables?: ClassConstructor[];
    middlawares?: ClassConstructor[];
    controllers?: ClassConstructor[];
}): <T_1 extends ClassConstructor>(constructor: T_1) => {
    new (...args: any[]): {
        [x: string]: any;
        readonly __port: number;
        __dataSource?: DataSource | undefined;
        __onLoaded?: Promise<void> | undefined;
        readonly __originalConstructor: ClassConstructor;
        readonly __middlawares: MiddlewareImplicitImpl[];
        readonly __controllers: ControllerImplicitImpl[];
    };
} & T_1;
