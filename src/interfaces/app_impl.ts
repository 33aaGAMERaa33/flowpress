import { ClassConstructor } from "../defines/class_constructor";
import { DatabaseConfigImpl } from "./database_config.impl";
import { GlobalMiddlewareImpl } from "./global_middleware.impl";
import { MiddlewareImpl } from "./middleware.impl";

export interface AppImpl {
    port: number;
    databaseConfig: DatabaseConfigImpl;
    controllers: Object[],
    injectables: Object[],
    middlewares: ClassConstructor<MiddlewareImpl>[],
    globalMiddlewares: ClassConstructor<GlobalMiddlewareImpl>[],
}