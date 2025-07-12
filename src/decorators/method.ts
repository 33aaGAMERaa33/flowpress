import { HttpMethod } from "../enums/http_method";
import { CONTROLLER_METHODS_METADATA_KEY } from "../constants/metadata_keys/controller_methods";

export type MethodDefine = [
    string | symbol, 
    HttpMethod,
    string | undefined,
];

export function Method(method: HttpMethod, path?: string): MethodDecorator {
    return function(target, propertyKey, _) {
        // Pega as definições dos metodos de rota antes guardados
        const methodsDefine: MethodDefine[] = Reflect.getMetadata(CONTROLLER_METHODS_METADATA_KEY, target.constructor) ?? [];

        // Adiciona a nova definição
        methodsDefine.push([propertyKey, method, path]);

        // Guarda em metadados na classe
        Reflect.defineMetadata(CONTROLLER_METHODS_METADATA_KEY, methodsDefine, target.constructor);
    }
}