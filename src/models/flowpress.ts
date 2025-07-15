import { APP_METADATA_KEY } from "../constants/metadata_keys/app";
import { HttpException } from "../exceptions/http_exception";
import { AppImplicitImpl } from "../interfaces/app_instance.implicit.impl";
import http, { IncomingMessage } from "http";
import url  from "url";
import { RequestParamBinding } from "../decorators/request_params";
import { RequestParam } from "../enums/request_param";
import { ControllerImplicitImpl } from "../interfaces/controller.implicit.impl";
import { Route } from "./route";
import { HttpMethod } from "../enums/http_method";

export class Flowpress {
    private readonly app: AppImplicitImpl;

    private constructor(app: AppImplicitImpl) {
        this.app = app;
    }

    get port() {
        return this.app.__port;
    }

    private getRouteHandler(parsedUrl: url.UrlWithParsedQuery, method: HttpMethod): void | [ControllerImplicitImpl, Route] {
        for(const controller of this.app.__controllers) {
            for(const route of controller.__routes) {
                if(route.path === parsedUrl.pathname && route.method === method) {
                    return [controller, route];
                }
            }
        }
    }

    static async start(app: any): Promise<Flowpress> {
        // Verifica se a instancia fornecida é um app
        if(!Reflect.getMetadata(APP_METADATA_KEY, app)) 
            throw new Error("A instancia fornecida não contém metadados de app");

        const appInstance = app as AppImplicitImpl; // Se a instancia fornecida for um app, ele será de forma implicita AppImplicitImpl
        const flowpress = new Flowpress(app);

        const server = http.createServer(async (req, res) => {
            const parsedUrl = url.parse(req.url ?? "", true);
            const [controller, route] = flowpress.getRouteHandler(parsedUrl, req.method! as HttpMethod) ?? [];

            if(controller !== undefined && route !== undefined) {
                try {
                    let response;
                    const args: any[] = [];

                    const methodsParamsMetadata: Record<string | symbol, RequestParamBinding[]> = Reflect.getMetadata(RequestParam.MetadataKey, controller.__originalConstructor) ?? {};

                    const methodParams = methodsParamsMetadata[route.propertyKey];

                    if(methodParams !== undefined) {
                        for(const [requestParam, parameterIndex] of methodParams) {
                            switch(requestParam) {
                                case RequestParam.headers:
                                    args[parameterIndex] = req.headers;
                                    break;
                                case RequestParam.query:
                                    args[parameterIndex] = parsedUrl.query;
                                    break;
                                case RequestParam.body:
                                    try {
                                        args[parameterIndex] = await this.parseRequestBody(req);
                                    }catch(_) {}
                                    
                                    break;
                            }
                        }
                    }

                    const handlerResult = await route.handler(...args);
                    const headers: Record<string, any> = {};

                    if(typeof handlerResult !== "object") {
                        response = handlerResult;
                        headers["Content-Type"] = "text/plain";
                    }else {
                        response = JSON.stringify(handlerResult);
                        headers["Content-Type"] = "application/json";
                    }

                    res.writeHead(200, headers);
                    res.end(response);
                }catch(e) {
                    if(e instanceof HttpException) {
                        let response = undefined;
                        const headers: Record<string, any> = {};

                        if(typeof e.message !== "object") {
                            headers["content-type"] = "text/plain";    
                            response = e.message;
                        }else {
                            headers["content-type"] = "application/json";    
                            response = JSON.stringify(e.message);
                        }

                        res.writeHead(e.status, headers);
                        res.end(response);
                    }else {
                        throw e;
                    }
                }
            }else {
                res.writeHead(404);
                res.end();
            }
        });

        return await new Promise<Flowpress>((resolve) => server.listen(appInstance.__port, () => resolve(flowpress)));
    }
    
    private static async parseRequestBody(req: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            let body = '';

            req.on('data', chunk => {
                body += chunk;
            });

            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    reject(err);
                }
            });

            req.on('error', err => {
                reject(err);
            });
        });
    }

}