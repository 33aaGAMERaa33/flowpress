import { RequestParam } from "../enums/request_param";

export type MethodsRequestParamsDefine = Record<string | symbol, RequestParamBinding[]>;
export type RequestParamBinding = [RequestParam, number, any];

function createRequestParamDecorator(target: Object, propertyKey: string | symbol, parameterIndex: number, requestParam: RequestParam, value?: any) {
    // Caso propertyKey seja nulo, significa que a anotação foi feita em um parametro do construtor
    if(propertyKey === undefined) return;

    // Pega os parametros de requisição antes guardados
    const methodParamsMetadata: MethodsRequestParamsDefine = Reflect.getMetadata(RequestParam.MetadataKey, target.constructor) ?? {};

    // Cria uma lista caso não tenha
    methodParamsMetadata[propertyKey] ??= [];

    // Adiciona o parametro de requisição requerido
    methodParamsMetadata[propertyKey].push([requestParam, parameterIndex, value]);

    // Guarda no construtor via metadados
    Reflect.defineMetadata(RequestParam.MetadataKey, methodParamsMetadata, target.constructor);
}

export const Body = (target: Object, propertyKey: string | symbol, parameterIndex: number) => 
    createRequestParamDecorator(target, propertyKey, parameterIndex, RequestParam.body);
export const Query = (target: Object, propertyKey: string | symbol, parameterIndex: number) => 
    createRequestParamDecorator(target, propertyKey, parameterIndex, RequestParam.query);
export const Req = (target: Object, propertyKey: string | symbol, parameterIndex: number) => 
    createRequestParamDecorator(target, propertyKey, parameterIndex, RequestParam.request);
export const Res = (target: Object, propertyKey: string | symbol, parameterIndex: number) => 
    createRequestParamDecorator(target, propertyKey, parameterIndex, RequestParam.response);
export const Headers = (target: Object, propertyKey: string | symbol, parameterIndex: number) => 
    createRequestParamDecorator(target, propertyKey, parameterIndex, RequestParam.headers);
export const Header = (header: string) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => 
    createRequestParamDecorator(target, propertyKey, parameterIndex, RequestParam.header, header);
export const MiddlewaresData = (target: Object, propertyKey: string | symbol, parameterIndex: number) => 
    createRequestParamDecorator(target, propertyKey, parameterIndex, RequestParam.middlewaresData);