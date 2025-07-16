import { AppImplicitImpl } from "../interfaces/app_instance.implicit.impl";
import { Route } from "../models/route";
import { ArgsBuilderBuilderArgs } from "./args_builder";
import { ControllerImplicitImpl } from "../interfaces/controller.implicit.impl";
export declare class MiddlewareRunner {
    private constructor();
    static run(appInstance: AppImplicitImpl, controller: ControllerImplicitImpl, route: Route, argsBuilderBuilderArgs: ArgsBuilderBuilderArgs): Promise<void>;
}
