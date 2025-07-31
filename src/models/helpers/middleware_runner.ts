import { Route } from "../route";
import { ArgsBuilder, ArgsBuilderBuilderArgs } from "./args_builder";
import { MiddlewareData } from "../middleware_data";
import { ControllerImplicitImpl } from "../../interfaces/controller.implicit.impl";
import { USE_MIDDLEWARE_METADATA_KEY } from "../../constants/metadata_keys/use_middleware";
import { RoutesMiddlewares } from "../../decorators/use_middleware";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../../constants/metadata_keys/original-constructor";
import { MiddlewareType } from "../../enums/middleware_type";
import { MiddlewareImplicitImpl } from "../../interfaces/middleware.implicit.impl";
import { GlobalMiddlewareImplicitImpl } from "../../interfaces/global_middleware.implicit.impl";
import { GlobalMiddlewareType } from "../../enums/global_middlaware_type";

export class MiddlewareRunner {
    // Metodo para executar os middlawares de uma rota especifica
    static async runRouteMiddlewares(
        middlewares: MiddlewareImplicitImpl[], 
        controller: ControllerImplicitImpl, 
        route: Route, 
        argsBuilderBuilderArgs: ArgsBuilderBuilderArgs,
        middlewareType: MiddlewareType,
    ): Promise<void> {
        // Pega os middleware das rotas
        const routesMiddlewares: RoutesMiddlewares = Reflect.getMetadata(USE_MIDDLEWARE_METADATA_KEY, controller.__originalConstructor) ?? {};
        // Pega os middlewares da rota especificada
        const routeMiddlewares = routesMiddlewares[route.propertyKey] ?? [];
        // Intera sobre os middlewares da rota para executalos
        for(const routeMiddleware of routeMiddlewares) {
            // Pega o construtor original do middleware
            const middlewareOriginalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, routeMiddleware) ?? routeMiddleware;
            // Procura entre os middlewares registrados e verifica se o middleware foi registrado no app
            for(const middleware of middlewares) {
                // Verifica se o middleware é igual ao da rota, se não for pula ele
                if(middlewareOriginalConstructor !== middleware.__originalConstructor || middleware.type !== middlewareType) continue;
                // Adiciona um MiddlewareData para guardar os dados do middleware
                argsBuilderBuilderArgs.middlawaresData.middlewaresData.push(new MiddlewareData(middlewareOriginalConstructor));
                // Constroi os parametros de chamada do middleware
                const args = ArgsBuilder.build({
                    ...argsBuilderBuilderArgs,
                    instance: middleware,
                    propertyKey: "handler",
                });
                // Executa o middleware
                await middleware.handler(...args);
            }
        }
    }

    static async runGlobalMiddlewares(
        middlewares: GlobalMiddlewareImplicitImpl[], 
        argsBuilderBuilderArgs: ArgsBuilderBuilderArgs,
        middlewareType: GlobalMiddlewareType,
    ) {
        // Procura entre os middlewares registrados e verifica se o middleware foi registrado no app
        for(const middleware of middlewares) {
            // Verifica se o middleware é igual ao da rota, se não for pula ele
            if(middleware.type !== middlewareType) continue;
            // Adiciona um MiddlewareData para guardar os dados do middleware
            argsBuilderBuilderArgs.middlawaresData.middlewaresData.push(new MiddlewareData(middleware.__originalConstructor));
            // Constroi os parametros de chamada do middleware
            const args = ArgsBuilder.build({
                ...argsBuilderBuilderArgs,
                instance: middleware,
                propertyKey: "handler",
            });
            // Executa o middleware
            await middleware.handler(...args);
        }
    }
}