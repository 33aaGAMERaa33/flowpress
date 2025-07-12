import { ClassConstructor } from "../defines/class_constructor";
import { InjectableImplicitImpl } from "../interfaces/injectable.implicit.impl";
import { INJECTABLE_METADATA_KEY } from "../constants/metadata_keys/injectable";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../constants/metadata_keys/original-constructor";

export function Injectable() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        // Define que é injetavel
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, originalConstructor);

        // Implementa a injectable de forma implicita
        const newConstructor = class extends constructor implements InjectableImplicitImpl {
            readonly __originalConstructor: ClassConstructor = originalConstructor;

            constructor(...args: any[]) {
                super(...args);
            }
        };

        // Guarda o construtor original em metadados no novo construtor
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);

        return newConstructor;
    }
}