import { FIELDS_TO_INJECT_METADATA_KEY } from "../constants/metadata_keys/fields_to_inject";
import { InjectionType } from "../enums/injection_type.enum";

export type InjectDefine = [InjectionType, string | symbol, any];

function createInjectDecorator(type: InjectionType, value: any): PropertyDecorator {
    return function(target, propertyKey) {
        const injects: InjectDefine[] = Reflect.getMetadata(FIELDS_TO_INJECT_METADATA_KEY, target.constructor) ?? [];
        
        // Verifica se já foi adicionado, caso tenha sido não adiciona denovo
        if(injects.find((injectDefine) => injectDefine[1] === propertyKey) === undefined)
            injects.push([type, propertyKey, value]); // Adiciona o tipo junto com o nome da propriedade para injeção futura
        
        // Guarda em metadados
        Reflect.defineMetadata(FIELDS_TO_INJECT_METADATA_KEY, injects, target.constructor);
    }
}

export const Inject = (): PropertyDecorator =>
    (target, propertyKey) =>
        createInjectDecorator(InjectionType.injectable, Reflect.getMetadata("design:type", target, propertyKey))(target, propertyKey);

export const InjectRepository = (entity: Object): PropertyDecorator => createInjectDecorator(InjectionType.repository, entity);