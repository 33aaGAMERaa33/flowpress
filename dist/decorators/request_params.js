"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Headers = exports.Res = exports.Query = exports.Body = void 0;
const request_param_1 = require("../enums/request_param");
function createRequestParamDecorator(requestParam) {
    return function (target, propertyKey, parameterIndex) {
        // Caso propertyKey seja nulo, significa que a anotação foi feita em um parametro do construtor
        if (propertyKey === undefined)
            return;
        // Pega os parametros de requisição antes guardados
        const methodParamsMetadata = Reflect.getMetadata(request_param_1.RequestParam.MetadataKey, target.constructor) ?? {};
        // Cria uma lista caso não tenha
        methodParamsMetadata[propertyKey] ??= [];
        // Adiciona o parametro de requisição requerido
        methodParamsMetadata[propertyKey].push([requestParam, parameterIndex]);
        // Guarda no construtor via metadados
        Reflect.defineMetadata(request_param_1.RequestParam.MetadataKey, methodParamsMetadata, target.constructor);
    };
}
const Body = () => createRequestParamDecorator(request_param_1.RequestParam.body);
exports.Body = Body;
const Query = () => createRequestParamDecorator(request_param_1.RequestParam.query);
exports.Query = Query;
const Res = () => createRequestParamDecorator(request_param_1.RequestParam.response);
exports.Res = Res;
const Headers = () => createRequestParamDecorator(request_param_1.RequestParam.headers);
exports.Headers = Headers;
