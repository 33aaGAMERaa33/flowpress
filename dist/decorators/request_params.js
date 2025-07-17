"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewaresData = exports.Header = exports.Headers = exports.Res = exports.Req = exports.Query = exports.Body = void 0;
const request_param_1 = require("../enums/request_param");
function createRequestParamDecorator(target, propertyKey, parameterIndex, requestParam, value) {
    // Caso propertyKey seja nulo, significa que a anotação foi feita em um parametro do construtor
    if (propertyKey === undefined)
        return;
    // Pega os parametros de requisição antes guardados
    const methodParamsMetadata = Reflect.getMetadata(request_param_1.RequestParam.MetadataKey, target.constructor) ?? {};
    // Cria uma lista caso não tenha
    methodParamsMetadata[propertyKey] ??= [];
    // Adiciona o parametro de requisição requerido
    methodParamsMetadata[propertyKey].push([requestParam, parameterIndex, value]);
    // Guarda no construtor via metadados
    Reflect.defineMetadata(request_param_1.RequestParam.MetadataKey, methodParamsMetadata, target.constructor);
}
const Body = (target, propertyKey, parameterIndex) => createRequestParamDecorator(target, propertyKey, parameterIndex, request_param_1.RequestParam.body);
exports.Body = Body;
const Query = (target, propertyKey, parameterIndex) => createRequestParamDecorator(target, propertyKey, parameterIndex, request_param_1.RequestParam.query);
exports.Query = Query;
const Req = (target, propertyKey, parameterIndex) => createRequestParamDecorator(target, propertyKey, parameterIndex, request_param_1.RequestParam.request);
exports.Req = Req;
const Res = (target, propertyKey, parameterIndex) => createRequestParamDecorator(target, propertyKey, parameterIndex, request_param_1.RequestParam.response);
exports.Res = Res;
const Headers = (target, propertyKey, parameterIndex) => createRequestParamDecorator(target, propertyKey, parameterIndex, request_param_1.RequestParam.headers);
exports.Headers = Headers;
const Header = (header) => (target, propertyKey, parameterIndex) => createRequestParamDecorator(target, propertyKey, parameterIndex, request_param_1.RequestParam.header, header);
exports.Header = Header;
const MiddlewaresData = (target, propertyKey, parameterIndex) => createRequestParamDecorator(target, propertyKey, parameterIndex, request_param_1.RequestParam.middlewaresData);
exports.MiddlewaresData = MiddlewaresData;
