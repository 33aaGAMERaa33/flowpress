import { RequestParam } from "../enums/request_param";

export type RequestParamBinding = [RequestParam, number];

function createRequestParamDecorator(requestParam: RequestParam): ParameterDecorator {
    return function(target, propertyKey, parameterIndex) {
        // Caso propertyKey seja nulo, significa que a anotação foi feita em um parametro do construtor
        if(propertyKey === undefined) return;

        // Pega os parametros de requisição antes guardados
        const methodParamsMetadata: Record<string | symbol, RequestParamBinding[]> = Reflect.getMetadata(RequestParam.MetadataKey, target.constructor) ?? {};

        // Cria uma lista caso não tenha
        methodParamsMetadata[propertyKey] ??= [];

        // Adiciona o parametro de requisição requerido
        methodParamsMetadata[propertyKey].push([requestParam, parameterIndex]);

        // Guarda no construtor via metadados
        Reflect.defineMetadata(RequestParam.MetadataKey, methodParamsMetadata, target.constructor);
    }
}

export const Body = () => createRequestParamDecorator(RequestParam.body);
export const Query = () => createRequestParamDecorator(RequestParam.query);
export const Headers = () => createRequestParamDecorator(RequestParam.headers);