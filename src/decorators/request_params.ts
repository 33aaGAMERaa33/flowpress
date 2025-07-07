import { RequestParam } from "../enums/request_param";

export type RequestParamDefine = [RequestParam, number];

function createRequestParam(requestParam: RequestParam): ParameterDecorator {
    return function(target, propertyKey, parameterIndex) {
        // Caso propertyKey seja nulo, significa que a anotação foi feita em um parametro do construtor
        if(propertyKey === undefined) return;

        // Pega os parametros de requisição antes guardados
        const requestParams: Record<string | symbol, RequestParamDefine[]> = Reflect.getMetadata(RequestParam.all, target.constructor) ?? {};

        // Cria uma lista caso não tenha
        requestParams[propertyKey] ??= [];

        // Adiciona o parametro de requisição requerido
        requestParams[propertyKey].push([requestParam, parameterIndex]);

        // Guarda no construtor via metadados
        Reflect.defineMetadata(RequestParam.all, requestParams, target.constructor);
    }
}

export const Headers = () => createRequestParam(RequestParam.headers);
export const Body = () => createRequestParam(RequestParam.body);
export const Query = () => createRequestParam(RequestParam.query);