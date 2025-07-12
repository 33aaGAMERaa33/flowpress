import { ClassConstructor } from "../defines/class_constructor";

export interface InstanceImplicitImpl {
    __originalConstructor: ClassConstructor;
}