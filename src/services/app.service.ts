import { AppInstanceImpl } from "../interfaces/app_instance.impl";
import { APP_METADATA_KEY } from "../metadata_keys/app";
import express, { Express } from "express";
import { Route } from "../models/route";
import { ControllerImpl } from "../interfaces/controller.impl";
import { HttpException } from "../exceptions/http_exception";
import { LogService } from "./log.service";
import { HttpStatus } from "../enums/http_status";
import { RequestParamDefine } from "../decorators/request_params";
import { RequestParam } from "../enums/request_param";
import { ClassConstructor } from "../defines/class_constructor";
import { USE_MIDDLAWARE_METADATA_KEY } from "../metadata_keys/use_middlaware";

export class AppService {
    static async start(app: any): Promise<Express> {
        // Verifica se a instancia está declarada como app
        if(!Reflect.getMetadata(APP_METADATA_KEY, app)) 
            throw new Error(`A instancia fornecida não tem metadados de app`);
        
        const server = express();

        server.use(express.json());
        server.use(express.urlencoded({ extended: true }));

        // Se a instancia está declarada como app, ela vai ter implementado de forma implicita AppInstanceImpl, que contém os dados que vai ser necessario
        const appInstance = (app as unknown) as AppInstanceImpl;

        const implementedRoutes: [ControllerImpl, Route][] = [];
        for(const controller of appInstance.__controllers) {
            for(const route of controller.__routes) {
                // Verifica se a rota já foi implementada
                for (const [controllerClass, otherRoute] of implementedRoutes) {
                    if (route.path === otherRoute.path && route.method === otherRoute.method) {
                        throw new Error(`Rotas duplicadas nos controladores ${controller.__constructor.name} e ${controllerClass.__constructor.name} para ${route.path} via ${route.method}`);
                    }
                }

                // Adiciona a rota em um set
                implementedRoutes.push([controller, route]);

                /* 
                Pega o enum HttpMethod e converte para letras minusculas,
                com isso usa para pegar a função de adição de rotas, e depois linka com a instacia do servidor
                */
                const addRoute = (server as any)[route.method.toLowerCase()].bind(server);

                addRoute(route.path, async (req: express.Request, res: express.Response) => {
                    function buildArgs<T extends ClassConstructor>(constructor: T, propertyKey: string | symbol) {
                        const args: any[] = [];

                        // Busca os metadados que contém os tipos dos parametros de requisição requisitados
                        const requestParams: Record<string | symbol, RequestParamDefine[]> = Reflect.getMetadata(RequestParam.all, constructor) ?? {};
                        // Pega os metadados referentes à rota atual
                        const handlerRequestParams = requestParams[propertyKey];

                        // Verifica se os metadados existem
                        if(handlerRequestParams !== undefined) {
                            for(const [requestParam, parameterIndex] of handlerRequestParams) {
                                // Pega o valor via bracket notation, aqui o valor do enum deve ser exatamente igual ao valor requerido
                                const value = (req as any)[requestParam];

                                if(value === undefined) throw new Error(`Parametro de requisição não reconhecido ${requestParam}`);

                                args[parameterIndex] = value;
                            }
                        }

                        return args;
                    }
                    
                    try {
                        // Pega os middlawares registrados pela rotas no controlador
                        const handlersMiddlawares = Reflect.getMetadata(USE_MIDDLAWARE_METADATA_KEY, controller.__constructor);

                        if(handlersMiddlawares) {
                            // Pega os middlawares especificos da rota
                            const handlerMiddlawares = handlersMiddlawares[route.propertyKey];
                            
                            // Verifica se existe
                            if(handlerMiddlawares !== undefined) {
                                // Intera sobre os middlawares para usa-los
                                for(const middlawareConstructor of handlerMiddlawares) {
                                    // Procura o middlaware na instancia do aplicativo
                                    const middlaware = appInstance.__middlawares.find((middlaware) => middlaware.__constructor === Object.getPrototypeOf(middlawareConstructor));
                                    
                                    // Verifica se ele não foi encontrado, se não foi pula ele
                                    if(middlaware === undefined) continue;
                                    
                                    // Procura os argumentos necessarios dentro dos metadados do handler
                                    const args = buildArgs(middlaware.__constructor, "handler");
                                    const result = await middlaware.handler(...args);
                                    
                                    // Verifica se tem retorno
                                    if(result !== undefined) {
                                        // Envia o que foi retornado
                                        res.send(result);
                                        // Cancela o resto do trabalho
                                        return;
                                    }
                                }
                            }
                        }

                        // Envia o resultado da requisição
                        res.send(await route.handler(...buildArgs(controller.__constructor, route.propertyKey)));
                    }catch(e) {
                        // Verifica se o tipo da exceção é HttpException, caso seja envia o status e uma mensagem caso tiver
                        if(e instanceof HttpException) {
                            // Verifica se tem um erro para ser imprimido
                            if(e.error !== undefined) {
                                LogService.error(`Erro no controlador ${controller.__constructor.name} na rota ${route.path}`);
                                LogService.error(e.error);
                            }
                            
                            res.status(e.status).send(e.message !== undefined ? {message: e.message} : undefined);
                        }else { // Caso o tipo do erro nao seja HttpException ele imprime o erro e envia um status de codigo de erro interno, junto com uma mensagem de erro interno
                            LogService.error(e);

                            res.status(HttpStatus.InternalError).send({
                                message: "Erro interno no servidor",
                            });
                        }
                    }
                });
            }
        }

        server.listen(appInstance.__port);
        return server;
    }
}