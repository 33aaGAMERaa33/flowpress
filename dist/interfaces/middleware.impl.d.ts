import { MiddlewareType } from "../enums/middleware_type";
import { BaseMiddlewareImpl } from "./base_middleware.impl";
export interface MiddlewareImpl extends BaseMiddlewareImpl {
    type: MiddlewareType;
}
