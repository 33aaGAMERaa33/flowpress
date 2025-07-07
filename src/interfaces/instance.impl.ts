import { ClassConstructor } from "../defines/class_constructor";

export interface InstanceImpl {
    __constructor: ClassConstructor;
}