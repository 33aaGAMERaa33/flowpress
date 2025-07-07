import { ClassConstructor } from "../defines/class_constructor";
import { InjectableImpl } from "../interfaces/injectable.impl";
import { INJECTABLE_METADATA_KEY } from "../metadata_keys/injectable";

export function Injectable() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Define que é injetavel
        Reflect.defineMetadata(INJECTABLE_METADATA_KEY, true, constructor);

        // Implementa a injectable de forma implicita
        return class extends constructor implements InjectableImpl {
            readonly __constructor: ClassConstructor = constructor;

            constructor(...args: any[]) {
                super(...args);
            }
        }
    }
}