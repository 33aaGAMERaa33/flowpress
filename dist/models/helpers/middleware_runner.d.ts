import { Route } from "../route";
import { ArgsBuilderBuilderArgs } from "./args_builder";
import { ControllerImplicitImpl } from "../../interfaces/controller.implicit.impl";
import { MiddlewareType } from "../../enums/middleware_type";
import { MiddlewareImplicitImpl } from "../../interfaces/middleware.implicit.impl";
import { GlobalMiddlewareImplicitImpl } from "../../interfaces/global_middleware.implicit.impl";
import { GlobalMiddlewareType } from "../../enums/global_middlaware_type";
export declare class MiddlewareRunner {
    private constructor();
    static runRouteMiddlewares(middlewares: MiddlewareImplicitImpl[], controller: ControllerImplicitImpl, route: Route, argsBuilderBuilderArgs: ArgsBuilderBuilderArgs, middlewareType: MiddlewareType): Promise<void>;
    static runGlobalMiddlewares(middlewares: GlobalMiddlewareImplicitImpl[], argsBuilderBuilderArgs: ArgsBuilderBuilderArgs, middlewareType: GlobalMiddlewareType): Promise<void>;
}
