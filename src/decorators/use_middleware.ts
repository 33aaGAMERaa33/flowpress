import { ClassConstructor } from "../defines/class_constructor";
import { USE_MIDDLEWARE_METADATA_KEY } from "../constants/metadata_keys/use_middleware";
import { MiddlewareImpl } from "../interfaces/middleware.impl";

export type RoutesMiddlewares = Record<string | symbol, ClassConstructor[]>;

export function UseMiddleware<T extends ClassConstructor<MiddlewareImpl>>(middlewareConstructor: T, ): MethodDecorator {
    return function(target, propertyKey, _) {
        // Pega as definições de middlawares que vai ser usado
        const routesMiddlewares: RoutesMiddlewares = Reflect.getMetadata(USE_MIDDLEWARE_METADATA_KEY, target.constructor) ?? {};

        // Instancia a lista caso não esteja
        routesMiddlewares[propertyKey] ??= [];

        // Adiciona o construtor do middlaware
        routesMiddlewares[propertyKey].push(middlewareConstructor);

        // Guarda em metadados no construtor
        Reflect.defineMetadata(USE_MIDDLEWARE_METADATA_KEY, routesMiddlewares, target.constructor);
    }
}