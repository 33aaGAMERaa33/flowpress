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
const response_data_1 = require("./response_data");
const http_status_1 = require("../enums/http_status");
const middlawares_data_1 = require("./middlawares_data");
const router_resolver_1 = require("../services/router_resolver");
const middleware_runner_1 = require("../services/middleware_runner");
const args_builder_1 = require("../services/args_builder");
class Flowpress {
    app;
    constructor(app) {
        this.app = app;
    }
    get port() {
        return this.app.__port;
    }
    static async start(app) {
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
                const response = new response_data_1.ResponseData();
                const body = await Flowpress.parseRequestBody(req);
                const middlawaresData = new middlawares_data_1.MiddlewaresDataContainer();
                const argsBuilderBuilderArgs = {
                    instance: controller,
                    propertyKey: route.propertyKey,
                    body: body,
                    parsedUrl: parsedUrl,
                    req: req,
                    response: response,
                    middlawaresData: middlawaresData,
                };
                await middleware_runner_1.MiddlewareRunner.run(appInstance, controller, route, argsBuilderBuilderArgs);
                const args = args_builder_1.ArgsBuilder.build(argsBuilderBuilderArgs);
                const handlerResult = await route.handler(...args);
                Flowpress.resolveResponse(handlerResult, response, res);
            }
            catch (e) {
                Flowpress.handleError(e, res);
            }
        });
        return await new Promise((resolve) => server.listen(appInstance.__port, () => resolve(flowpress)));
    }
    static async parseRequestBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                }
                catch (err) {
                    reject(err);
                }
            });
            req.on('error', err => {
                reject(err);
            });
        });
    }
    static resolveResponse(result, response, res) {
        const finalData = response.getData() ?? result;
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
    static handleError(error, res) {
        if (error instanceof http_exception_1.HttpException) {
            const response = new response_data_1.ResponseData();
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
            throw error;
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
