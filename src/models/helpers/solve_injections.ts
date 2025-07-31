import { InjectableImplicitImpl } from "../../interfaces/injectable.implicit.impl";
import { InstanceImplicitImpl } from "../../interfaces/instance.implicit.impl";
import { FIELDS_TO_INJECT_METADATA_KEY } from "../../constants/metadata_keys/fields_to_inject";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../../constants/metadata_keys/original-constructor";
import { InjectDefine } from "../../decorators/injections";
import { InjectionType } from "../../enums/injection_type.enum";
import { DataSource } from "typeorm";

export class SolveInjectionsService {
    private constructor() {

    }

    static solveInjectables<T extends InstanceImplicitImpl>(instance: T, injectables: InjectableImplicitImpl[], data: {
        passResolved: boolean;
        ignoreNotResolved: boolean;
    }) {
        const injections: InjectDefine[] = Reflect.getMetadata(FIELDS_TO_INJECT_METADATA_KEY, instance.__originalConstructor);

        if(injections === undefined) return;

        for(const [type, propertyKey, inject] of injections) {
            if(type !== InjectionType.injectable) continue;

            let resolved = false;

            if(data.passResolved && (instance as any)[propertyKey] !== undefined) continue;

            for(const injectable of injectables) {
                if(Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, inject) === injectable.__originalConstructor) {
                    resolved = true;
                    Object.defineProperty(instance, propertyKey, {
                        value: injectable,
                        writable: false,
                    });
                }
            }

            if(!resolved && !data.ignoreNotResolved) 
                throw new Error(`Não foi possivel resolver a injeção de ${Object.getPrototypeOf(inject).name} em ${Object.getPrototypeOf(instance.__originalConstructor).name}`);
        }
    }
    
    static solveRepositories<T extends InstanceImplicitImpl>(instance: T, dataSource?: DataSource) {
        const injections: InjectDefine[] = Reflect.getMetadata(FIELDS_TO_INJECT_METADATA_KEY, instance.__originalConstructor);

        if(injections === undefined) return;
        if(dataSource === undefined)
            throw new Error(`Não foi possivel resolver a injeção de repositorio em ${instance.__originalConstructor.name} pois o banco de dados não foi definido`);

        for(const [type, propertyKey, entity] of injections) {
            if(type !== InjectionType.repository) continue;

            const repository = dataSource.getRepository(entity);

            Object.defineProperty(instance, propertyKey, {
                value: repository,
                writable: false,
            });
        }
    }
}