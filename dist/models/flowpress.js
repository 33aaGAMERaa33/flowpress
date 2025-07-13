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
class Flowpress {
    app;
    constructor(app) {
        this.app = app;
    }
    get port() {
        return this.app.__port;
    }
    getRouteHandler(parsedUrl) {
        for (const controller of this.app.__controllers) {
            for (const route of controller.__routes) {
                if (route.path === parsedUrl.pathname) {
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
            const [controller, route] = flowpress.getRouteHandler(parsedUrl) ?? [];
            if (controller && route !== undefined) {
                try {
                    let response;
                    const args = [];
                    const methodsParamsMetadata = Reflect.getMetadata(request_param_1.RequestParam.MetadataKey, controller.__originalConstructor) ?? {};
                    for (const propertyKey in methodsParamsMetadata) {
                        const methodParams = methodsParamsMetadata[propertyKey];
                        for (const [requestParam, parameterIndex] of methodParams) {
                            switch (requestParam) {
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
                    const headers = {};
                    if (typeof handlerResult !== "object") {
                        response = handlerResult;
                        headers["Content-Type"] = "text/plain";
                    }
                    else {
                        response = JSON.stringify(handlerResult);
                        headers["Content-Type"] = "application/json";
                    }
                    res.writeHead(200, headers);
                    res.end(response);
                }
                catch (e) {
                    if (e instanceof http_exception_1.HttpException) {
                        let response = undefined;
                        const headers = {};
                        if (typeof e.message !== "object") {
                            headers["content-type"] = "text/plain";
                            response = e.message;
                        }
                        else {
                            headers["content-type"] = "application/json";
                            response = JSON.stringify(e.message);
                        }
                        res.writeHead(e.status, headers);
                        res.end(response);
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
    static async parseRequestBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => (body += chunk));
            req.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                }
                catch (err) {
                    reject(err);
                }
            });
            req.on('error', reject);
        });
    }
}
exports.Flowpress = Flowpress;
