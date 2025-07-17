"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = AppConfig;
const app_1 = require("../constants/metadata_keys/app");
const controller_1 = require("../constants/metadata_keys/controller");
const injectable_1 = require("../constants/metadata_keys/injectable");
const middelware_1 = require("../constants/metadata_keys/middelware");
const instances_pending_injections_1 = require("../constants/metadata_keys/instances_pending_injections");
const solve_injections_1 = require("../models/helpers/solve_injections");
const app_declaration_service_1 = require("../services/app_declaration.service");
const module_1 = require("../constants/metadata_keys/module");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
const database_config_1 = require("../constants/metadata_keys/database_config");
const typeorm_1 = require("typeorm");
function AppConfig(data) {
    return function (constructor) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        let dataSource;
        const [databaseConfigConstructor, modulesConstructor, controllersConstructor, middlewaresConstructor, injectablesConstructor, globalMiddlewaresConstructor,] = [
            data.databaseConfig,
            data.modules ?? [],
            data.controllers ?? [],
            data.middlewares ?? [],
            data.injectables ?? [],
            data.globalMiddlewares ?? [],
        ];
        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const controllersInstance = app_declaration_service_1.AppDeclarationService.instanceImplicitImplements(controllersConstructor, (controllerConstructor) => {
            // Valida se a classe é um controllador
            if (!Reflect.getMetadata(controller_1.CONTROLLER_METADATA_KEY, controllerConstructor))
                throw new Error(`A classe ${controllerConstructor.name} não tem metadados de controlador`);
        });
        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const middlewaresInstance = app_declaration_service_1.AppDeclarationService.instanceImplicitImplements(middlewaresConstructor, (middlewareConstructor) => {
            // Valida se a classe é um controllador
            if (!Reflect.getMetadata(middelware_1.MIDDLEWARE_METADATA_KEY, middlewareConstructor))
                throw new Error(`A classe ${middlewareConstructor.name} não tem metadados de middleware`);
        });
        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const globalMiddlewaresInstance = app_declaration_service_1.AppDeclarationService.instanceImplicitImplements(globalMiddlewaresConstructor, (middlewareConstructor) => {
            // Valida se a classe é um controllador
            if (!Reflect.getMetadata(middelware_1.MIDDLEWARE_METADATA_KEY, middlewareConstructor))
                throw new Error(`A classe ${middlewareConstructor.name} não tem metadados de middleware`);
        });
        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const injectablesInstance = app_declaration_service_1.AppDeclarationService.instanceImplicitImplements(injectablesConstructor, (injectableConstructor) => {
            // Valida se a classe é um controllador
            if (!Reflect.getMetadata(injectable_1.INJECTABLE_METADATA_KEY, injectableConstructor))
                throw new Error(`A classe ${injectableConstructor.name} não tem metadados de injetável`);
        });
        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const modulesInstance = app_declaration_service_1.AppDeclarationService.instanceImplicitImplements(modulesConstructor, (moduleConstructor) => {
            // Valida se a classe é um modulo
            if (!Reflect.getMetadata(module_1.MODULE_METADATA_KEY, moduleConstructor))
                throw new Error(`A classe ${moduleConstructor.name} não tem metadados de modulo`);
        }, (instance) => {
            for (const controller of instance.__controllers) {
                controllersInstance.push(controller);
            }
            for (const injectable of instance.__exports) {
                if (injectablesInstance.find((otherInjectble) => otherInjectble.__originalConstructor == injectable.__originalConstructor))
                    throw new Error(`Foi encontrado mais de uma instancia do injetavel ${injectable.__originalConstructor.name}`);
                injectablesInstance.push(injectable);
            }
        });
        for (const controller of controllersInstance) {
            for (const otherController of controllersInstance) {
                // Pula caso seja a mesma instancia
                if (controller === otherController)
                    continue;
                if (controller.__originalConstructor === otherController.__originalConstructor)
                    throw new Error(`O controlador ${controller.__originalConstructor.name} está duplicado`);
                for (const route of controller.__routes) {
                    if (otherController.__routes.find((otherRoute) => route.path === otherRoute.path && route.method === otherRoute.method))
                        throw new Error(`A rota ${route.path} via ${route.method} está duplicada nos controladores ${controller.__originalConstructor.name} e ${otherController.__originalConstructor.name}`);
                }
            }
        }
        if (databaseConfigConstructor) {
            if (!Reflect.getMetadata(database_config_1.DATABASE_CONFIG_METADATA_KEY, databaseConfigConstructor))
                throw new Error(`A classe ${databaseConfigConstructor.name} não tem metadados para configuração do banco de dados`);
            const databaseConfigInstance = new databaseConfigConstructor();
            dataSource = new typeorm_1.DataSource({
                ...databaseConfigInstance,
            });
        }
        // Guarda o construtor original em metadados
        Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, constructor);
        // Pega a classe original, extende ela e implementa AppInstanceImpl
        // Futuramente isso vai servir para implementar as rotas
        const newConstructor = class extends constructor {
            __port;
            __dataSource;
            __onLoaded;
            __originalConstructor = constructor;
            __controllers = controllersInstance;
            __middlewares = middlewaresInstance;
            __globalMiddlewares = globalMiddlewaresInstance;
            constructor(...args) {
                super(...args);
                this.__port = data.port(this);
                // Define que a instancia é um app
                Reflect.defineMetadata(app_1.APP_METADATA_KEY, true, this);
                this.__onLoaded = new Promise(async (resolve) => {
                    // Pega as instancias que tem a injeção pendente
                    const instancesPendingInjections = Reflect.getMetadata(instances_pending_injections_1.INSTANCES_PENDING_INJECTIONS, AppConfig);
                    if (dataSource)
                        this.__dataSource = await dataSource?.initialize();
                    // verifica se tem instancias com injeção pendente
                    if (instancesPendingInjections !== undefined) {
                        // Resolve as injeções, ignorando as injeções que já foram resolvidas
                        for (const instance of instancesPendingInjections) {
                            if (instance.__originalConstructor === undefined)
                                throw new Error(`Não é possivel resolver as injeções de ${instance} pois não implementa InstanceImpl`);
                            solve_injections_1.SolveInjectionsService.solveInjectables(instance, injectablesInstance, {
                                passResolved: true,
                                ignoreNotResolved: false,
                            });
                            solve_injections_1.SolveInjectionsService.solveRepositories(instance, this.__dataSource);
                        }
                    }
                    resolve();
                });
            }
        };
        // Guarda o construtor original em metadados
        Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        return newConstructor;
    };
}
