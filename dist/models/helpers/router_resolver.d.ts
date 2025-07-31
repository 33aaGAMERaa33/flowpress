import { HttpMethod } from "../../enums/http_method";
import { AppImplicitImpl } from "../../interfaces/app_instance.implicit.impl";
import { ControllerImplicitImpl } from "../../interfaces/controller.implicit.impl";
import { Route } from "../route";
export declare class RouteResolver {
    private constructor();
    static resolve(appInstance: AppImplicitImpl, path: string, method: HttpMethod): [ControllerImplicitImpl, Route] | undefined;
}
