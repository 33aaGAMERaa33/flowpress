import { CONTROLLER_METADATA_KEY } from "../constants/metadata_keys/controller";
import { INJECTABLE_METADATA_KEY } from "../constants/metadata_keys/injectable";
import { MODULE_METADATA_KEY } from "../constants/metadata_keys/module";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../constants/metadata_keys/original-constructor";
import { ClassConstructor } from "../defines/class_constructor";
import { ControllerImplicitImpl } from "../interfaces/controller.implicit.impl";
import { InjectableImplicitImpl } from "../interfaces/injectable.implicit.impl";
import { ModuleImplicitImpl } from "../interfaces/module.implicit.impl";
import { AppDeclarationService } from "../services/app_declaration.service";
import { SolveInjectionsService } from "../models/helpers/solve_injections";

export function Module(data: {
    injectables?: ClassConstructor[],
    controllers?: ClassConstructor[],
    exports?: ClassConstructor[],
}) {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        const [controllers, injectables, exports] = [data.controllers ?? [], data.injectables ?? [], data.exports ?? []];
        const exportsInstance: InjectableImplicitImpl[] = [];

        // Instancia as classes injetaveis
        const injectablesInstances = AppDeclarationService.instanceImplicitImplements<InjectableImplicitImpl>(injectables, (injectableConstructor) => {
            // Verifica se é realmente uma classe injetavel
            if(!Reflect.getMetadata(INJECTABLE_METADATA_KEY, injectableConstructor)) 
                throw new Error(`A classe ${injectableConstructor.name} não tem metadados de injetavel`);
        }, (instance) => {
            // Verifica pelo construtor se a instancia é para exportar
            if(exports.find((toExport) => instance.__originalConstructor === Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, toExport))) {
                exportsInstance.push(instance);
            }
        });

        // Instancia os controladores
        const controllersInstance = AppDeclarationService.instanceImplicitImplements<ControllerImplicitImpl>(
            controllers, 
            (controllerConstructor) => {
                // Verifica se é realmente um controlador
                if(!Reflect.getMetadata(CONTROLLER_METADATA_KEY, controllerConstructor)) {
                    throw new Error(`A classe ${controllerConstructor.name} não tem metadados de controlador`)
                }
            }, 
            (controllerInstance) => {
                // Resolve as injeções pendentes com os injetaveis fornecidos
                SolveInjectionsService.solveInjectables(controllerInstance, injectablesInstances, {
                    passResolved: false,
                    ignoreNotResolved: true,
                });
            }
        );

        Reflect.defineMetadata(MODULE_METADATA_KEY, true, originalConstructor);

        const newConstructor = class extends constructor implements ModuleImplicitImpl {
            readonly __originalConstructor: ClassConstructor = originalConstructor;
            readonly __controllers: ControllerImplicitImpl[] = controllersInstance;
            readonly __exports: InjectableImplicitImpl[] = exportsInstance;
        };

        // Guarda o construtor original em metadados no novo construtor
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);

        return newConstructor;
    }
}