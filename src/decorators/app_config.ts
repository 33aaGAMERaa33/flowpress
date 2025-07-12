import { ClassConstructor } from "../defines/class_constructor";
import { AppImplicitImpl } from "../interfaces/app_instance.implicit.impl";
import { ControllerImplicitImpl } from "../interfaces/controller.implicit.impl";
import { InjectableImplicitImpl } from "../interfaces/injectable.implicit.impl";
import { InstanceImplicitImpl } from "../interfaces/instance.implicit.impl";
import { MiddlawareImplicitImpl } from "../interfaces/middlaware.implicit.impl";
import { APP_METADATA_KEY } from "../constants/metadata_keys/app";
import { CONTROLLER_METADATA_KEY } from "../constants/metadata_keys/controller";
import { INJECTABLE_METADATA_KEY } from "../constants/metadata_keys/injectable";
import { MIDDLAWARE_METADATA_KEY } from "../constants/metadata_keys/middalware";
import { INSTANCES_PENDING_INJECTIONS } from "../constants/metadata_keys/instances_pending_injections";
import { SolveInjectionsService } from "../services/solve_injections";
import { AppDeclarationService } from "../services/app_declaration.service";
import { ModuleImplicitImpl } from "../interfaces/module.implicit.impl";
import { MODULE_METADATA_KEY } from "../constants/metadata_keys/module";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../constants/metadata_keys/original-constructor";
import { DATABASE_CONFIG_METADATA_KEY } from "../constants/metadata_keys/database_config";
import { DatabaseConfigImpl } from "../interfaces/database_config.impl";
import { DataSource } from "typeorm";

export function AppConfig<T>(data: {
    port: (instance: T) => number, // Essa função é chamada após o instanciamento da classe
    databaseConfig?: ClassConstructor,
    modules?: ClassConstructor[],
    injectables?: ClassConstructor[],
    middlawares?: ClassConstructor[],
    controllers?: ClassConstructor[],
}) {
    return function <T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        let dataSource: DataSource | undefined;
        
        const [databaseConfigConstructor, modulesConstructor, controllersConstructor, middlawaresConstructor, injectablesConstructor] = [
            data.databaseConfig,
            data.modules ?? [], 
            data.controllers ?? [], 
            data.middlawares ?? [],
            data.injectables ?? []
        ];
        
        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const controllersInstance = AppDeclarationService.instanceImplicitImplements<ControllerImplicitImpl>(controllersConstructor, (controllerConstructor) => {
            // Valida se a classe é um controllador
            if(!Reflect.getMetadata(CONTROLLER_METADATA_KEY, controllerConstructor)) 
                throw new Error(`A classe ${controllerConstructor.name} não tem metadados de controlador`);
        });
        
        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const middlawaresInstance = AppDeclarationService.instanceImplicitImplements<MiddlawareImplicitImpl>(middlawaresConstructor, (middlawareConstructor) => {
            // Valida se a classe é um controllador
            if(!Reflect.getMetadata(MIDDLAWARE_METADATA_KEY, middlawareConstructor)) 
                throw new Error(`A classe ${middlawareConstructor.name} não tem metadados de middlaware`);

        });
        
        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const injectablesInstance = AppDeclarationService.instanceImplicitImplements<InjectableImplicitImpl>(injectablesConstructor, (injectableConstructor) => {
            // Valida se a classe é um controllador
            if(!Reflect.getMetadata(INJECTABLE_METADATA_KEY, injectableConstructor)) 
                throw new Error(`A classe ${injectableConstructor.name} não tem metadados de injetável`);
        });

        // Chama uma função para instanciar e retornar uma lista de instancias dos construtores usados
        const modulesInstance = AppDeclarationService.instanceImplicitImplements<ModuleImplicitImpl>(modulesConstructor, (moduleConstructor) => {
            // Valida se a classe é um modulo
            if(!Reflect.getMetadata(MODULE_METADATA_KEY, moduleConstructor)) 
                throw new Error(`A classe ${moduleConstructor.name} não tem metadados de modulo`);
        }, (instance) => {
            for(const controller of instance.__controllers) {
                controllersInstance.push(controller);
            }
        
            for(const injectable of instance.__exports) {
                if(injectablesInstance.find((otherInjectble) => otherInjectble.__originalConstructor == injectable.__originalConstructor)) 
                    throw new Error(`Foi encontrado mais de uma instancia do injetavel ${injectable.__originalConstructor.name}`);
        
                injectablesInstance.push(injectable);
            }
        });

        for(const controller of controllersInstance) {
            for(const otherController of controllersInstance) {
                // Pula caso seja a mesma instancia
                if(controller === otherController) continue;

                if(controller.__originalConstructor === otherController.__originalConstructor) 
                    throw new Error(`O controlador ${controller.__originalConstructor.name} está duplicado`);
                
                for(const route of controller.__routes) {
                    if(otherController.__routes.find((otherRoute) => route.path === otherRoute.path && route.method === otherRoute.method)) 
                        throw new Error(`A rota ${route.path} via ${route.method} está duplicada nos controladores ${controller.__originalConstructor.name} e ${otherController.__originalConstructor.name}`);
                }
            }
        }

        if(databaseConfigConstructor) {
            if(!Reflect.getMetadata(DATABASE_CONFIG_METADATA_KEY, databaseConfigConstructor)) 
                throw new Error(`A classe ${databaseConfigConstructor.name} não tem metadados para configuração do banco de dados`);

            const databaseConfigInstance: DatabaseConfigImpl = new databaseConfigConstructor();
            dataSource = new DataSource({
                ...databaseConfigInstance as any,
            });
        }

        // Guarda o construtor original em metadados
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, constructor);

        // Pega a classe original, extende ela e implementa AppInstanceImpl
        // Futuramente isso vai servir para implementar as rotas
        const newConstructor = class extends constructor implements AppImplicitImpl {
            readonly __port: number;
            __dataSource?: DataSource | undefined;
            __onLoaded?: Promise<void> | undefined;
            readonly __originalConstructor: ClassConstructor = constructor;
            readonly __middlawares: MiddlawareImplicitImpl[] = middlawaresInstance;
            readonly __controllers: ControllerImplicitImpl[] = controllersInstance;

            constructor(...args: any[]) {
                super(...args);
                this.__port = data.port(this as any);
                // Define que a instancia é um app
                Reflect.defineMetadata(APP_METADATA_KEY, true, this);

                this.__onLoaded = new Promise<void>(async (resolve) => {
                    // Pega as instancias que tem a injeção pendente
                    const instancesPendingInjections: InstanceImplicitImpl[] = Reflect.getMetadata(INSTANCES_PENDING_INJECTIONS, AppConfig);

                    if(dataSource)
                        this.__dataSource = await dataSource?.initialize();

                    // verifica se tem instancias com injeção pendente
                    if(instancesPendingInjections !== undefined) {
                        // Resolve as injeções, ignorando as injeções que já foram resolvidas
                        for(const instance of instancesPendingInjections) {
                            if(instance.__originalConstructor === undefined) 
                                throw new Error(`Não é possivel resolver as injeções de ${instance} pois não implementa InstanceImpl`);

                            SolveInjectionsService.solveInjectables(instance, injectablesInstance, {
                                passResolved: true,
                                ignoreNotResolved: false,
                            });

                            SolveInjectionsService.solveRepositories(instance, this.__dataSource);
                        }
                    }

                    resolve();
                });
            }
        };

        // Guarda o construtor original em metadados
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);

        return newConstructor;
    }
}