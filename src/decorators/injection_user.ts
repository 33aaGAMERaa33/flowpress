import { ClassConstructor } from "../defines/class_constructor";
import { InstanceImpl } from "../interfaces/instance.impl";
import { INSTANCES_PENDING_INJECTIONS } from "../metadata_keys/solve_injections";
import { AppDeclaration } from "./app.declaration";

export function InjectionUser() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Implementa de forma implicita InstanceImpl pois o construtor que guarda os dados essenciais para a injeção
        return class extends constructor implements InstanceImpl {
            readonly __constructor: ClassConstructor = constructor;

            constructor(...args: any[]) {
                super(...args);

                // Pega a fila de injeção de dependencia
                const instancesPedingInjections: Object[] = Reflect.getMetadata(INSTANCES_PENDING_INJECTIONS, AppDeclaration) ?? [];
                
                // Verifica se a instancia já foi adicionada a fila de injeção de dependencia, se não foi adiciona
                if(!instancesPedingInjections.includes(this)) {
                    // Adiciona a instancia à fila de injeção
                    instancesPedingInjections.push(this);

                    // Guarda essa fila com a instancia adicionada nos metadados de AppDeclaration
                    Reflect.defineMetadata(INSTANCES_PENDING_INJECTIONS, instancesPedingInjections, AppDeclaration);
                }
            }
        }
    }
}