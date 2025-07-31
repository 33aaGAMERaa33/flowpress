import { ClassConstructor } from "../defines/class_constructor";
export type UseMiddlawareDefine = [string | symbol, ClassConstructor];
export declare function UseMiddlaware<T extends ClassConstructor>(middlaware: T, canCancel?: boolean): MethodDecorator;
