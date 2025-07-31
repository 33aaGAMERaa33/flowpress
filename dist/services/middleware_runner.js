"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareRunner = void 0;
const args_builder_1 = require("./args_builder");
const middleware_data_1 = require("../models/middleware_data");
const use_middleware_1 = require("../constants/metadata_keys/use_middleware");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
class MiddlewareRunner {
    constructor() {
    }
    // Metodo para executar os middlawares de uma rota especifica
    static async run(appInstance, controller, route, argsBuilderBuilderArgs) {
        // Pega os middleware das rotas
        const routesMiddlewares = Reflect.getMetadata(use_middleware_1.USE_MIDDLEWARE_METADATA_KEY, controller.__originalConstructor) ?? {};
        // Pega os middlewares da rota especificada
        const routeMiddlewares = routesMiddlewares[route.propertyKey] ?? [];
        // Intera sobre os middlewares da rota para executalos
        for (const routeMiddleware of routeMiddlewares) {
            // Pega o construtor original do middleware
            const middlewareOriginalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, routeMiddleware) ?? routeMiddleware;
            // Procura entre os middlewares registrados e verifica se o middleware foi registrado no app
            for (const appMiddleware of appInstance.__middlawares) {
                // Verifica se o middleware é igual ao da rota, se não for pula ele
                if (middlewareOriginalConstructor !== appMiddleware.__originalConstructor)
                    continue;
                // Adiciona um MiddlewareData para guardar os dados do middleware
                argsBuilderBuilderArgs.middlawaresData.middlewaresData.push(new middleware_data_1.MiddlewareData(middlewareOriginalConstructor));
                // Constroi os parametros de chamada do middleware
                const args = args_builder_1.ArgsBuilder.build({
                    ...argsBuilderBuilderArgs,
                    instance: appMiddleware,
                    propertyKey: "handler",
                });
                // Executa o middleware
                await appMiddleware.handler(...args);
            }
        }
    }
}
exports.MiddlewareRunner = MiddlewareRunner;
