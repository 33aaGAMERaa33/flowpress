"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flowpress = void 0;
const app_1 = require("../constants/metadata_keys/app");
const http_exception_1 = require("../exceptions/http_exception");
const http_1 = __importDefault(require("http"));
const url_1 = __importDefault(require("url"));
const flow_response_1 = require("./flow_response");
const http_status_1 = require("../enums/http_status");
const middlawares_data_1 = require("./middlawares_data");
const router_resolver_1 = require("./helpers/router_resolver");
const middleware_runner_1 = require("./helpers/middleware_runner");
const args_builder_1 = require("./helpers/args_builder");
const flow_request_1 = require("./flow_request");
const middleware_type_1 = require("../enums/middleware_type");
const global_middlaware_type_1 = require("../enums/global_middlaware_type");
class Flowpress {
    app;
    constructor(app) {
        this.app = app;
    }
    get port() {
        return this.app.__port;
    }
    static async start(app, catchError) {
        if (!Reflect.getMetadata(app_1.APP_METADATA_KEY, app)) {
            throw new Error("A instancia fornecida não contém metadados de app");
        }
        const appInstance = app;
        const flowpress = new Flowpress(app);
        const server = http_1.default.createServer(async (req, res) => {
            const parsedUrl = url_1.default.parse(req.url ?? "", true);
            const routeHandler = router_resolver_1.RouteResolver.resolve(appInstance, parsedUrl.pathname, req.method);
            if (!routeHandler) {
                res.writeHead(404);
                res.end();
                return;
            }
            const [controller, route] = routeHandler;
            try {
                const flowRequest = new flow_request_1.FlowRequest(req);
                const flowResponse = new flow_response_1.FlowResponse();
                const body = await Flowpress.parseRequestBody(req);
                const middlawaresData = new middlawares_data_1.MiddlewaresDataContainer();
                const argsBuilderBuilderArgs = {
                    instance: controller,
                    propertyKey: route.propertyKey,
                    request: flowRequest,
                    response: flowResponse,
                    parsedUrl: parsedUrl,
                    body: body,
                    middlawaresData: middlawaresData,
                };
                await middleware_runner_1.MiddlewareRunner.runGlobalMiddlewares(appInstance.__globalMiddlewares, argsBuilderBuilderArgs, global_middlaware_type_1.GlobalMiddlewareType.beforeRequestMiddlewares);
                await middleware_runner_1.MiddlewareRunner.runRouteMiddlewares(appInstance.__middlewares, controller, route, argsBuilderBuilderArgs, middleware_type_1.MiddlewareType.request);
                await middleware_runner_1.MiddlewareRunner.runGlobalMiddlewares(appInstance.__globalMiddlewares, argsBuilderBuilderArgs, global_middlaware_type_1.GlobalMiddlewareType.afterRequestMiddlewares);
                const args = args_builder_1.ArgsBuilder.build(argsBuilderBuilderArgs);
                const handlerResult = await route.handler(...args);
                flowResponse.setData(handlerResult);
                await middleware_runner_1.MiddlewareRunner.runGlobalMiddlewares(appInstance.__globalMiddlewares, argsBuilderBuilderArgs, global_middlaware_type_1.GlobalMiddlewareType.beforeResposeMiddlewares);
                await middleware_runner_1.MiddlewareRunner.runRouteMiddlewares(appInstance.__middlewares, controller, route, argsBuilderBuilderArgs, middleware_type_1.MiddlewareType.response);
                await middleware_runner_1.MiddlewareRunner.runGlobalMiddlewares(appInstance.__globalMiddlewares, argsBuilderBuilderArgs, global_middlaware_type_1.GlobalMiddlewareType.afterResposeMiddlewares);
                Flowpress.resolveResponse(flowResponse, res);
            }
            catch (e) {
                Flowpress.handleError(e, res, route, catchError);
            }
        });
        return await new Promise((resolve) => server.listen(appInstance.__port, () => resolve(flowpress)));
    }
    static async parseRequestBody(req) {
        return new Promise((resolve, reject) => {
            let body = "";
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                try {
                    if (body !== undefined)
                        resolve(JSON.parse(body));
                    else
                        resolve(undefined);
                }
                catch (err) {
                    resolve(body);
                }
            });
            req.on('error', err => {
                reject(err);
            });
        });
    }
    static resolveResponse(response, res) {
        const finalData = response.getData();
        if (finalData !== undefined) {
            const [header, content] = Flowpress.parseContent(finalData);
            response.setHeader("Content-Type", header);
            response.setData(content);
            response.setHeader("Content-Length", Buffer.byteLength(content));
        }
        else {
            response.setStatusCode(http_status_1.HttpStatus.NoContent);
        }
        res.writeHead(response.getStatusCode(), response.getHeaders());
        res.end(response.getData());
    }
    static handleError(error, res, route, catchError) {
        if (error instanceof http_exception_1.HttpException) {
            const response = new flow_response_1.FlowResponse();
            if (error.message !== undefined) {
                const [header, content] = Flowpress.parseContent(error.message);
                response.setData(content);
                response.setHeaders({
                    "Content-Type": header,
                    "Content-Length": Buffer.byteLength(content),
                });
            }
            res.writeHead(error.status, response.getHeaders());
            res.end(response.getData());
        }
        else {
            res.writeHead(http_status_1.HttpStatus.InternalServerError);
            res.end();
            if (!catchError)
                throw error;
            catchError(route, error);
        }
    }
    static parseContent(content) {
        let header;
        let response;
        if (typeof content !== "object") {
            header = "text/plain; charset=utf-8";
            response = String(content);
        }
        else {
            header = "application/json; charset=utf-8";
            response = JSON.stringify(content);
        }
        return [header, response];
    }
}
exports.Flowpress = Flowpress;
