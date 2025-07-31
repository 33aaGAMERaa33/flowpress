import { GlobalMiddlewareType } from "../enums/global_middlaware_type";
import { BaseMiddlewareImpl } from "./base_middleware.impl";

export interface GlobalMiddlewareImpl extends BaseMiddlewareImpl {
    type: GlobalMiddlewareType;    
}