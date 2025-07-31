import { ClassConstructor } from "../defines/class_constructor";
import { Route } from "../models/route";
export declare function Controller(): <T extends ClassConstructor>(constructor: T) => {
    new (...args: any[]): {
        [x: string]: any;
        readonly __routes: Route[];
        readonly __originalConstructor: ClassConstructor;
    };
} & T;
