import { IncomingMessage } from "http";
import { UrlWithParsedQuery } from "url";
import { MiddlewaresDataContainer } from "../models/middlawares_data";
import { ResponseData } from "../models/response_data";
import { InstanceImplicitImpl } from "../interfaces/instance.implicit.impl";
import { RequestParam } from "../enums/request_param";
import { MethodsRequestParamsDefine } from "../decorators/request_params";

export class ArgsBuilder {
    private constructor() {

    }
    // Busca os parametros de chamada decorados sobre a instancia requisitada e constroi os parametros para a chamada
    static build(data: ArgsBuilderBuilderArgs): any[] {
        // Variavel para guardar os parametros definidos
        const args: any[] = [];
        // Pega os parametros dos metodos da classe que foi guardado
        const methodsRequestParams: MethodsRequestParamsDefine = Reflect.getMetadata(RequestParam.MetadataKey, data.instance.__originalConstructor) ?? {};
        // Pega especificamente o que foi requisitado para construir os argumentos
        const methodRequestParams = methodsRequestParams[data.propertyKey];

        // Intera sobre os parametros requisitados para construir os parametros de chamada
        for(const [requestParam, parameterIndex] of methodRequestParams) {
            const param = (() => {
                switch(requestParam){
                    case RequestParam.middlewaresData:
                        return data.middlawaresData
                    case RequestParam.response:
                        return data.response
                    case RequestParam.headers:
                        return data.req.headers
                    case RequestParam.query:
                        return data.parsedUrl.query;
                    case RequestParam.body:
                        return data.body;
                }
            })();

            args[parameterIndex] = param;
        }

        // Retorna os parametros de chamada
        return args;
    }
}

export interface ArgsBuilderBuilderArgs {
    instance: InstanceImplicitImpl, 
    propertyKey: string | symbol, 
    req: IncomingMessage, 
    response: ResponseData, 
    parsedUrl: UrlWithParsedQuery, 
    body: any, 
    middlawaresData: MiddlewaresDataContainer
}