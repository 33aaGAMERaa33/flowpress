import { ClassConstructor } from "../defines/class_constructor";
import { AppInstanceImpl } from "../interfaces/app_instance.impl";
import { ControllerImpl } from "../interfaces/controller.impl";
import { InjectableImpl } from "../interfaces/injectable.impl";
import { InstanceImpl } from "../interfaces/instance.impl";
import { MiddlawareImpl } from "../interfaces/middlaware.impl";
import { APP_METADATA_KEY } from "../metadata_keys/app";
import { CONTROLLER_METADATA_KEY } from "../metadata_keys/controller";
import { INJECTABLE_METADATA_KEY } from "../metadata_keys/injectable";
import { MIDDLAWARE_METADATA_KEY } from "../metadata_keys/middalware";
import { INSTANCES_PENDING_INJECTIONS } from "../metadata_keys/solve_injections";
import { SolveInjectionsService } from "../services/solve_injections";

export function AppDeclaration<T>(data: {
    port: (instance: T) => number, // Essa função é chamada após o instanciamento da classe
    services?: ClassConstructor[],
    middlawares?: ClassConstructor[],
    controllers?: ClassConstructor[],
}) {
    return function <T extends ClassConstructor>(constructor: T) {
        const [controllers, middlawares, services] = [
            data.controllers ?? [], 
            data.middlawares ?? [],
            data.services ?? []
        ];
        const controllersInstance: ControllerImpl[] = [];
        const middlawaresInstance: MiddlawareImpl[] = [];
        const injectablesInstance: InjectableImpl[] = [];

        for(const injectableConstructor of services) {
            // Valida se o construtor fornecido é injetavel
            // Se não for gera um erro em tempo de execução
            if(!Reflect.getMetadataKeys(injectableConstructor).includes(INJECTABLE_METADATA_KEY)) 
                throw new Error(`A classe ${injectableConstructor.name} não tem metadados de injetavel`);

            // Instancia a classe e adiciona na lista de injetaveis
            const injectableInstance = new injectableConstructor();
            injectablesInstance.push(injectableInstance as InjectableImpl);
        }

        for(const middlawareConstructor of middlawares) {
            // Valida se o construtor fornecido é um middlaware
            if(!Reflect.getMetadata(MIDDLAWARE_METADATA_KEY, middlawareConstructor)) 
                throw new Error(`A classe ${middlawareConstructor.name} não tem metadados de middlaware`);

            // Instancia o middlaware e adiciona na lista de middlawares
            const middlawareInstance = new middlawareConstructor();
            middlawaresInstance.push(middlawareInstance as MiddlawareImpl);
        }

        for(const controllerConstructor of controllers) {
            // Valida se a classe é um controllador
            if(!Reflect.getMetadata(CONTROLLER_METADATA_KEY, controllerConstructor)) 
                throw new Error(`A classe ${controllerConstructor.name} não tem metadados de controlador`);

            // Instancia e adiciona à lista de controladores
            const controllerInstance = new controllerConstructor();
            controllersInstance.push(controllerInstance as ControllerImpl);
        }

        // Pega a classe original, extende ela e implementa AppInstanceImpl
        // Futuramente isso vai servir para implementar as rotas
        return class extends constructor implements AppInstanceImpl {
            readonly __port: number;
            readonly __constructor: ClassConstructor = constructor;
            readonly __middlawares: MiddlawareImpl[] = middlawaresInstance;
            readonly __controllers: ControllerImpl[] = controllersInstance;

            constructor(...args: any[]) {
                super(...args);
                this.__port = data.port(this as any);
                // Define que a instancia é um app
                Reflect.defineMetadata(APP_METADATA_KEY, true, this);

                // Pega as instancias que tem a injeção pendente
                const instancesPendingInjections: InstanceImpl[] = Reflect.getMetadata(INSTANCES_PENDING_INJECTIONS, AppDeclaration);

                // verifica se tem instancias com injeção pendente
                if(instancesPendingInjections !== undefined) {
                    // Resolve as injeções, ignorando as injeções que já foram resolvidas
                    for(const instance of instancesPendingInjections) {
                        if(instance.__constructor === undefined) throw new Error(`Não é possivel resolver as injeções de ${instance} pois não implementa InstanceImpl`);

                        SolveInjectionsService.solve(instance, injectablesInstance, {
                            ignoreResolved: true,
                            ignoreNotResolved: false,
                        });
                    }
                }
            }
        };
    }
}