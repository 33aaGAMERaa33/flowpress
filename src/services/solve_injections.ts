import { InjectableImpl } from "../interfaces/injectable.impl";
import { InstanceImpl } from "../interfaces/instance.impl";
import { INJECT_METADATA_KEY } from "../metadata_keys/inject";

export class SolveInjectionsService {
    private constructor() {

    }

    static async solve<T extends InstanceImpl>(instance: T, injectables: InjectableImpl[], data: {
        ignoreResolved: boolean;
        ignoreNotResolved: boolean;
    }) {
        const injections = Reflect.getMetadata(INJECT_METADATA_KEY, instance.__constructor.prototype);

        if(!injections) return;

        for(const [propertyKey, inject] of injections) {
            let resolved = false;

            for(const injectable of injectables) {
                if(Object.getPrototypeOf(inject) === injectable.__constructor) {
                    resolved = true;
                    Object.defineProperty(instance, propertyKey, {
                        value: injectable,
                        writable: false,
                    });
                    break;
                }
            }

            if(!resolved && !data.ignoreNotResolved) 
                throw new Error(`Não foi possivel resolver a injeção de ${Object.getPrototypeOf(inject).name} em ${Object.getPrototypeOf(instance.__constructor).name}`);
        }
    }
}