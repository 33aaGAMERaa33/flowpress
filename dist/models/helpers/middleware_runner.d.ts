import { AppImplicitImpl } from "../../interfaces/app_instance.implicit.impl";
import { Route } from "../route";
import { ArgsBuilderBuilderArgs } from "./args_builder";
import { ControllerImplicitImpl } from "../../interfaces/controller.implicit.impl";
export declare class MiddlewareRunner {
    private constructor();
    private static run;
    static runRequestMiddlewares(appInstance: AppImplicitImpl, controller: ControllerImplicitImpl, route: Route, argsBuilderBuilderArgs: ArgsBuilderBuilderArgs): Promise<void>;
    static runResponseMiddlewares(appInstance: AppImplicitImpl, controller: ControllerImplicitImpl, route: Route, argsBuilderBuilderArgs: ArgsBuilderBuilderArgs): Promise<void>;
}
