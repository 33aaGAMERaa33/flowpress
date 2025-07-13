import { ClassConstructor } from "../defines/class_constructor";
import { MiddlawareImpl } from "../interfaces/middlaware.impl";
export declare function Middalware<T extends ClassConstructor<MiddlawareImpl>>(constructor: T): T;
