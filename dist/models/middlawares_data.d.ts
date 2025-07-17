import { ClassConstructor } from "../defines/class_constructor";
import { GlobalMiddlewareImpl } from "../interfaces/global_middleware.impl";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { MiddlewareData } from "./middleware_data";
export declare class MiddlewaresDataContainer {
    readonly middlewaresData: MiddlewareData[];
    getMiddlawareData<T extends MiddlewareImpl | GlobalMiddlewareImpl>(middlewareConstructor: ClassConstructor<T>): MiddlewareData | undefined;
}
