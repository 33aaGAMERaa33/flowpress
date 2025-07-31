import { ClassConstructor } from "../defines/class_constructor";
import { InstanceImplicitImpl } from "../interfaces/instance.implicit.impl";
import { INSTANCES_PENDING_INJECTIONS } from "../constants/metadata_keys/instances_pending_injections";
import { AppConfig } from "./app_config";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../constants/metadata_keys/original-constructor";

export function InjectionUser() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        
        // Implementa de forma implicita InstanceImpl pois o construtor que guarda os dados essenciais para a injeção
        const newConstructor = class extends constructor implements InstanceImplicitImpl {
            readonly __originalConstructor: ClassConstructor = originalConstructor;

            constructor(...args: any[]) {
                super(...args);

                // Pega a fila de injeção de dependencia
                const instancesPedingInjections: Object[] = Reflect.getMetadata(INSTANCES_PENDING_INJECTIONS, AppConfig) ?? [];
                
                // Verifica se a instancia já foi adicionada a fila de injeção de dependencia, se não foi adiciona
                if(!instancesPedingInjections.includes(this)) {
                    // Adiciona a instancia à fila de injeção
                    instancesPedingInjections.push(this);

                    // Guarda essa fila com a instancia adicionada nos metadados de AppDeclaration
                    Reflect.defineMetadata(INSTANCES_PENDING_INJECTIONS, instancesPedingInjections, AppConfig);
                }
            }
        };
        
        // Guarda o construtor original em metadados no novo construtor
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);

        return newConstructor;
    }
}