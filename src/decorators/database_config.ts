import { DATABASE_CONFIG_METADATA_KEY } from "../constants/metadata_keys/database_config";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../constants/metadata_keys/original-constructor";
import { ClassConstructor } from "../defines/class_constructor";
import { DatabaseConfigImpl } from "../interfaces/database_config.impl";
import { InstanceImplicitImpl } from "../interfaces/instance.implicit.impl";

export function DataSourceConfig<T extends ClassConstructor<DatabaseConfigImpl>>(construtor: T) {
    // Pega o construtor original
    const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, construtor) ?? construtor;

    // Cria um novo construtor para implementar de forma implicita dados essenciais
    const newConstructor = class extends construtor implements InstanceImplicitImpl {
        readonly __originalConstructor: ClassConstructor = originalConstructor;

        constructor(...args: any[]) {
            super(...args);
        }
    }

    // Guarda o construtor original
    Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
    
    Reflect.defineMetadata(DATABASE_CONFIG_METADATA_KEY, true, originalConstructor);

    return newConstructor;
}