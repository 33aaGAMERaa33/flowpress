"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseMiddleware = UseMiddleware;
const use_middleware_1 = require("../constants/metadata_keys/use_middleware");
function UseMiddleware(middlewareConstructor) {
    return function (target, propertyKey, _) {
        // Pega as definições de middlawares que vai ser usado
        const routesMiddlewares = Reflect.getMetadata(use_middleware_1.USE_MIDDLEWARE_METADATA_KEY, target.constructor) ?? {};
        // Instancia a lista caso não esteja
        routesMiddlewares[propertyKey] ??= [];
        // Adiciona o construtor do middlaware
        routesMiddlewares[propertyKey].push(middlewareConstructor);
        // Guarda em metadados no construtor
        Reflect.defineMetadata(use_middleware_1.USE_MIDDLEWARE_METADATA_KEY, routesMiddlewares, target.constructor);
    };
}
