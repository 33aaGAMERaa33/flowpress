import { ClassConstructor } from "../defines/class_constructor";
import { ControllerImplicitImpl } from "../interfaces/controller.implicit.impl";
import { InjectableImplicitImpl } from "../interfaces/injectable.implicit.impl";
export declare function Module(data: {
    injectables?: ClassConstructor[];
    controllers?: ClassConstructor[];
    exports?: ClassConstructor[];
}): <T extends ClassConstructor>(constructor: T) => {
    new (...args: any[]): {
        [x: string]: any;
        readonly __originalConstructor: ClassConstructor;
        readonly __controllers: ControllerImplicitImpl[];
        readonly __exports: InjectableImplicitImpl[];
    };
} & T;
