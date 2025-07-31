import { ClassConstructor } from "../defines/class_constructor";
export declare function InjectionUser(): <T extends ClassConstructor>(constructor: T) => {
    new (...args: any[]): {
        [x: string]: any;
        readonly __originalConstructor: ClassConstructor;
    };
} & T;
