import { HttpMethod } from "../../enums/http_method";
import { AppImplicitImpl } from "../../interfaces/app_instance.implicit.impl";
import { ControllerImplicitImpl } from "../../interfaces/controller.implicit.impl";
import { Route } from "../route";

export class RouteResolver {
    private constructor(){

    }

    static resolve(appInstance: AppImplicitImpl, path: string, method: HttpMethod): [ControllerImplicitImpl, Route] | undefined {
        for(const controller of appInstance.__controllers) {
            for(const route of controller.__routes) {
                if(route.path === path && route.method === method) {
                    return [controller, route];
                }
            }
        }

        return undefined;
    }
}