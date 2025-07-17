"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgsBuilder = void 0;
const request_param_1 = require("../../enums/request_param");
class ArgsBuilder {
    constructor() {
    }
    // Busca os parametros de chamada decorados sobre a instancia requisitada e constroi os parametros para a chamada
    static build(data) {
        // Variavel para guardar os parametros definidos
        const args = [];
        // Pega os parametros dos metodos da classe que foi guardado
        const methodsRequestParams = Reflect.getMetadata(request_param_1.RequestParam.MetadataKey, data.instance.__originalConstructor) ?? {};
        // Pega especificamente o que foi requisitado para construir os argumentos
        const methodRequestParams = methodsRequestParams[data.propertyKey] ?? [];
        // Intera sobre os parametros requisitados para construir os parametros de chamada
        for (const [requestParam, parameterIndex, value] of methodRequestParams) {
            const param = (() => {
                switch (requestParam) {
                    case request_param_1.RequestParam.middlewaresData:
                        return data.middlawaresData;
                    case request_param_1.RequestParam.request:
                        return data.request;
                    case request_param_1.RequestParam.response:
                        return data.response;
                    case request_param_1.RequestParam.headers:
                        return data.request.getHeaders();
                    case request_param_1.RequestParam.header:
                        return data.request.getHeader(value);
                    case request_param_1.RequestParam.query:
                        return data.parsedUrl.query;
                    case request_param_1.RequestParam.body:
                        return data.body;
                }
            })();
            args[parameterIndex] = param;
        }
        // Retorna os parametros de chamada
        return args;
    }
}
exports.ArgsBuilder = ArgsBuilder;
