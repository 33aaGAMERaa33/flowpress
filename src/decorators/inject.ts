import { INJECT_METADATA_KEY } from "../metadata_keys/inject";

export type InjectDefine = [string | symbol, object];

export function Inject(): PropertyDecorator {
    return function(target, propertyKey) {
        // Pega o tipo da propriedade
        const inject = Reflect.getMetadata("design:type", target, propertyKey);
        // Pega os tipos guardados
        const injects: InjectDefine[] = Reflect.getMetadata(INJECT_METADATA_KEY, target) ?? [];

        // Adiciona o tipo junto com o nome da propriedade para injeção futura
        injects.push([propertyKey, inject]);
        
        // Guarda em metadados
        Reflect.defineMetadata(INJECT_METADATA_KEY, injects, target);
    }
}