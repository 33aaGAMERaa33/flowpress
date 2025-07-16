import { ClassConstructor } from "../defines/class_constructor";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { MiddlewareData } from "./middleware_data";
export declare class MiddlewaresDataContainer {
    readonly middlewaresData: MiddlewareData[];
    getMiddlawareData<T extends MiddlewareImpl>(middlewareConstructor: ClassConstructor<T>): MiddlewareData | undefined;
}
