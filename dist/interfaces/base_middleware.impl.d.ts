import { GlobalMiddlewareType } from "../enums/global_middlaware_type";
import { MiddlewareType } from "../enums/middleware_type";
export interface BaseMiddlewareImpl {
    type: GlobalMiddlewareType | MiddlewareType;
    handler(...args: any[]): Promise<void> | void;
}
