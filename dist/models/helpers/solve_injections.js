"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolveInjectionsService = void 0;
const fields_to_inject_1 = require("../../constants/metadata_keys/fields_to_inject");
const original_constructor_1 = require("../../constants/metadata_keys/original-constructor");
const injection_type_enum_1 = require("../../enums/injection_type.enum");
class SolveInjectionsService {
    constructor() {
    }
    static solveInjectables(instance, injectables, data) {
        const injections = Reflect.getMetadata(fields_to_inject_1.FIELDS_TO_INJECT_METADATA_KEY, instance.__originalConstructor);
        if (injections === undefined)
            return;
        for (const [type, propertyKey, inject] of injections) {
            if (type !== injection_type_enum_1.InjectionType.injectable)
                continue;
            let resolved = false;
            if (data.passResolved && instance[propertyKey] !== undefined)
                continue;
            for (const injectable of injectables) {
                if (Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, inject) === injectable.__originalConstructor) {
                    resolved = true;
                    Object.defineProperty(instance, propertyKey, {
                        value: injectable,
                        writable: false,
                    });
                }
            }
            if (!resolved && !data.ignoreNotResolved)
                throw new Error(`Não foi possivel resolver a injeção de ${Object.getPrototypeOf(inject).name} em ${Object.getPrototypeOf(instance.__originalConstructor).name}`);
        }
    }
    static solveRepositories(instance, dataSource) {
        const injections = Reflect.getMetadata(fields_to_inject_1.FIELDS_TO_INJECT_METADATA_KEY, instance.__originalConstructor);
        if (injections === undefined)
            return;
        if (dataSource === undefined)
            throw new Error(`Não foi possivel resolver a injeção de repositorio em ${instance.__originalConstructor.name} pois o banco de dados não foi definido`);
        for (const [type, propertyKey, entity] of injections) {
            if (type !== injection_type_enum_1.InjectionType.repository)
                continue;
            const repository = dataSource.getRepository(entity);
            Object.defineProperty(instance, propertyKey, {
                value: repository,
                writable: false,
            });
        }
    }
}
exports.SolveInjectionsService = SolveInjectionsService;
