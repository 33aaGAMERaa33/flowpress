"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteResolver = void 0;
class RouteResolver {
    constructor() {
    }
    static resolve(appInstance, path, method) {
        for (const controller of appInstance.__controllers) {
            for (const route of controller.__routes) {
                if (route.path === path && route.method === method) {
                    return [controller, route];
                }
            }
        }
        return undefined;
    }
}
exports.RouteResolver = RouteResolver;
