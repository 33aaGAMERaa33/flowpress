"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectRepository = exports.Inject = void 0;
const fields_to_inject_1 = require("../constants/metadata_keys/fields_to_inject");
const injection_type_enum_1 = require("../enums/injection_type.enum");
function createInjectDecorator(type, value) {
    return function (target, propertyKey) {
        const injects = Reflect.getMetadata(fields_to_inject_1.FIELDS_TO_INJECT_METADATA_KEY, target.constructor) ?? [];
        // Verifica se já foi adicionado, caso tenha sido não adiciona denovo
        if (injects.find((injectDefine) => injectDefine[1] === propertyKey) === undefined)
            injects.push([type, propertyKey, value]); // Adiciona o tipo junto com o nome da propriedade para injeção futura
        // Guarda em metadados
        Reflect.defineMetadata(fields_to_inject_1.FIELDS_TO_INJECT_METADATA_KEY, injects, target.constructor);
    };
}
const Inject = () => (target, propertyKey) => createInjectDecorator(injection_type_enum_1.InjectionType.injectable, Reflect.getMetadata("design:type", target, propertyKey))(target, propertyKey);
exports.Inject = Inject;
const InjectRepository = (entity) => createInjectDecorator(injection_type_enum_1.InjectionType.repository, entity);
exports.InjectRepository = InjectRepository;
