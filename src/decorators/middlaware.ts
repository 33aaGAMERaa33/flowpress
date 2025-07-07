import { ClassConstructor } from "../defines/class_constructor";
import { InstanceImpl } from "../interfaces/instance.impl";
import { MIDDLAWARE_METADATA_KEY } from "../metadata_keys/middalware";

export function Middalware() {
    return function<T extends ClassConstructor>(constructor: T) {
        Reflect.defineMetadata(MIDDLAWARE_METADATA_KEY, true, constructor);

        return class extends constructor implements InstanceImpl {
            readonly __constructor: ClassConstructor = constructor;
        }
    }
}