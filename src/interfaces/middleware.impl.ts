import { MiddlewareType } from "../enums/middleware_type";

export interface MiddlewareImpl {
    type: MiddlewareType;
    handler(...args: any[]): Promise<void> | void;
}