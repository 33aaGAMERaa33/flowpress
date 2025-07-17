import { IncomingMessage } from "http";
import { UrlWithParsedQuery } from "url";
import { MiddlewaresDataContainer } from "../middlawares_data";
import { FlowResponse } from "../flow_response";
import { InstanceImplicitImpl } from "../../interfaces/instance.implicit.impl";
import { RequestParam } from "../../enums/request_param";
import { MethodsRequestParamsDefine } from "../../decorators/request_params";
import { FlowRequest } from "../flow_request";

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
        const methodRequestParams = methodsRequestParams[data.propertyKey] ?? [];

        // Intera sobre os parametros requisitados para construir os parametros de chamada
        for(const [requestParam, parameterIndex, value] of methodRequestParams) {
            const param = (() => {
                switch(requestParam){
                    case RequestParam.middlewaresData:
                        return data.middlawaresData
                    case RequestParam.request:
                        return data.request;
                    case RequestParam.response:
                        return data.response;
                    case RequestParam.headers:
                        return data.request.getHeaders();
                    case RequestParam.header:
                        return data.request.getHeader(value);
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
    instance: InstanceImplicitImpl;
    propertyKey: string | symbol;
    request: FlowRequest; 
    response: FlowResponse;
    parsedUrl: UrlWithParsedQuery;
    body: any;
    middlawaresData: MiddlewaresDataContainer;
}