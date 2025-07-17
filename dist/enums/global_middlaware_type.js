"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalMiddlewareType = void 0;
var GlobalMiddlewareType;
(function (GlobalMiddlewareType) {
    GlobalMiddlewareType[GlobalMiddlewareType["beforeRequestMiddlewares"] = 0] = "beforeRequestMiddlewares";
    GlobalMiddlewareType[GlobalMiddlewareType["afterRequestMiddlewares"] = 1] = "afterRequestMiddlewares";
    GlobalMiddlewareType[GlobalMiddlewareType["beforeResposeMiddlewares"] = 2] = "beforeResposeMiddlewares";
    GlobalMiddlewareType[GlobalMiddlewareType["afterResposeMiddlewares"] = 3] = "afterResposeMiddlewares";
})(GlobalMiddlewareType || (exports.GlobalMiddlewareType = GlobalMiddlewareType = {}));
