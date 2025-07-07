import { ClassConstructor } from "../defines/class_constructor";
import { USE_MIDDLAWARE_METADATA_KEY } from "../metadata_keys/use_middlaware";

export type UseMiddlawareDefine = [string | symbol, ClassConstructor];

export function UseMiddlaware<T extends ClassConstructor>(middlaware: T): MethodDecorator {
    return function(target, propertyKey, _) {
        // Pega as definições de middlawares que vai ser usado
        const useMiddlawaresDefine: Record<string | symbol, T[]> = Reflect.getMetadata(USE_MIDDLAWARE_METADATA_KEY, target.constructor) ?? {};

        // Instancia a lista caso não esteja
        useMiddlawaresDefine[propertyKey] ??= [];

        // Adiciona o construtor do middlaware
        useMiddlawaresDefine[propertyKey].push(middlaware);

        // Guarda em metadados no construtor
        Reflect.defineMetadata(USE_MIDDLAWARE_METADATA_KEY, useMiddlawaresDefine, target.constructor);
    }
}