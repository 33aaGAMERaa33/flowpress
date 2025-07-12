import { ClassConstructor } from "../defines/class_constructor";
import { InstanceImplicitImpl } from "../interfaces/instance.implicit.impl";
import { MIDDLAWARE_METADATA_KEY } from "../constants/metadata_keys/middalware";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../constants/metadata_keys/original-constructor";
import { MiddlawareImpl } from "../interfaces/middlaware.impl";

export function Middalware<T extends ClassConstructor<MiddlawareImpl>>(constructor: T): T{
    const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;

    Reflect.defineMetadata(MIDDLAWARE_METADATA_KEY, true, originalConstructor);
    
    const newConstructor = class extends constructor implements InstanceImplicitImpl {
        readonly __originalConstructor: ClassConstructor = originalConstructor;
    };

    // Guarda o construtor original em metadados no novo construtor
    Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);

    return newConstructor;
}