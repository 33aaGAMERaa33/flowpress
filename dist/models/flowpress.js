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
const request_param_1 = require("../enums/request_param");
const response_data_1 = require("./response_data");
const http_status_1 = require("../enums/http_status");
class Flowpress {
    app;
    constructor(app) {
        this.app = app;
    }
    get port() {
        return this.app.__port;
    }
    getRouteHandler(parsedUrl, method) {
        for (const controller of this.app.__controllers) {
            for (const route of controller.__routes) {
                if (route.path === parsedUrl.pathname && route.method === method) {
                    return [controller, route];
                }
            }
        }
    }
    static async start(app) {
        // Verifica se a instancia fornecida é um app
        if (!Reflect.getMetadata(app_1.APP_METADATA_KEY, app))
            throw new Error("A instancia fornecida não contém metadados de app");
        const appInstance = app; // Se a instancia fornecida for um app, ele será de forma implicita AppImplicitImpl
        const flowpress = new Flowpress(app);
        const server = http_1.default.createServer(async (req, res) => {
            const parsedUrl = url_1.default.parse(req.url ?? "", true);
            const [controller, route] = flowpress.getRouteHandler(parsedUrl, req.method) ?? [];
            if (controller !== undefined && route !== undefined) {
                try {
                    const args = [];
                    const methodsParamsMetadata = Reflect.getMetadata(request_param_1.RequestParam.MetadataKey, controller.__originalConstructor) ?? {};
                    const methodParams = methodsParamsMetadata[route.propertyKey];
                    const response = new response_data_1.ResponseData();
                    if (methodParams !== undefined) {
                        for (const [requestParam, parameterIndex] of methodParams) {
                            switch (requestParam) {
                                case request_param_1.RequestParam.response:
                                    args[parameterIndex] = response;
                                    break;
                                case request_param_1.RequestParam.headers:
                                    args[parameterIndex] = req.headers;
                                    break;
                                case request_param_1.RequestParam.query:
                                    args[parameterIndex] = parsedUrl.query;
                                    break;
                                case request_param_1.RequestParam.body:
                                    try {
                                        args[parameterIndex] = await this.parseRequestBody(req);
                                    }
                                    catch (_) { }
                                    break;
                            }
                        }
                    }
                    const handlerResult = await route.handler(...args);
                    let responseData = response.getData();
                    if (responseData !== undefined) {
                        const [header, content] = this.parseContent(responseData);
                        response.setHeader("Content-Type", header);
                        response.setData(content);
                    }
                    else if (handlerResult !== undefined) {
                        const [header, content] = this.parseContent(handlerResult);
                        response.setHeader("Content-Type", header);
                        response.setData(content);
                    }
                    else {
                        response.setStatusCode(http_status_1.HttpStatus.NoContent);
                    }
                    response.setHeader("Content-Length", Buffer.byteLength(response.getData()));
                    res.writeHead(response.getStatusCode(), response.getHeaders());
                    res.end(response.getData());
                }
                catch (e) {
                    if (e instanceof http_exception_1.HttpException) {
                        const [header, content] = this.parseContent(e.message);
                        res.writeHead(e.status, {
                            "Content-Type": header,
                            "Content-Length": Buffer.byteLength(content),
                        });
                        res.end(content);
                    }
                    else {
                        throw e;
                    }
                }
            }
            else {
                res.writeHead(404);
                res.end();
            }
        });
        return await new Promise((resolve) => server.listen(appInstance.__port, () => resolve(flowpress)));
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
}
exports.Flowpress = Flowpress;
