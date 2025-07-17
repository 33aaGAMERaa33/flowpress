import { APP_METADATA_KEY } from "../constants/metadata_keys/app";
import { HttpException } from "../exceptions/http_exception";
import { AppImplicitImpl } from "../interfaces/app_instance.implicit.impl";
import http, { IncomingMessage } from "http";
import url from "url";
import { HttpMethod } from "../enums/http_method";
import { FlowResponse } from "./flow_response";
import { HttpStatus } from "../enums/http_status";
import { MiddlewaresDataContainer } from "./middlawares_data";
import { RouteResolver } from "./helpers/router_resolver";
import { MiddlewareRunner } from "./helpers/middleware_runner";
import { ArgsBuilder, ArgsBuilderBuilderArgs } from "./helpers/args_builder";
import { Route } from "./route";
import { FlowRequest } from "./flow_request";
import { MiddlewareType } from "../enums/middleware_type";
import { GlobalMiddlewareType } from "../enums/global_middlaware_type";

export class Flowpress {
  private readonly app: AppImplicitImpl;

  private constructor(app: AppImplicitImpl) {
    this.app = app;
  }

  get port() {
    return this.app.__port;
  }

  static async start(app: any, catchError?: (route: Route, e: unknown) => void): Promise<Flowpress> {
    if (!Reflect.getMetadata(APP_METADATA_KEY, app)) {
      throw new Error("A instancia fornecida não contém metadados de app");
    }

    const appInstance = app as AppImplicitImpl;
    const flowpress = new Flowpress(app);

    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url ?? "", true);
      const routeHandler = RouteResolver.resolve(appInstance, parsedUrl.pathname!, req.method! as HttpMethod);

      if (!routeHandler) {
        res.writeHead(404);
        res.end();
        return;
      }

      const [controller, route] = routeHandler;

      try {
        const flowRequest = new FlowRequest(req);
        const flowResponse = new FlowResponse();
        const body = await Flowpress.parseRequestBody(req);
        const middlawaresData = new MiddlewaresDataContainer();

        const argsBuilderBuilderArgs = {
            instance: controller,
            propertyKey: route.propertyKey,
            request: flowRequest,
            response: flowResponse,
            parsedUrl: parsedUrl,
            body: body,
            middlawaresData: middlawaresData,
        } as ArgsBuilderBuilderArgs;

        await MiddlewareRunner.runGlobalMiddlewares(appInstance.__globalMiddlewares, argsBuilderBuilderArgs, GlobalMiddlewareType.beforeRequestMiddlewares);
        await MiddlewareRunner.runRouteMiddlewares(appInstance.__middlewares, controller, route, argsBuilderBuilderArgs, MiddlewareType.request);
        await MiddlewareRunner.runGlobalMiddlewares(appInstance.__globalMiddlewares, argsBuilderBuilderArgs, GlobalMiddlewareType.afterRequestMiddlewares);
        
        const args = ArgsBuilder.build(argsBuilderBuilderArgs);
        const handlerResult = await route.handler(...args);
        
        flowResponse.setData(handlerResult);
        
        await MiddlewareRunner.runGlobalMiddlewares(appInstance.__globalMiddlewares, argsBuilderBuilderArgs, GlobalMiddlewareType.beforeResposeMiddlewares);
        await MiddlewareRunner.runRouteMiddlewares(appInstance.__middlewares, controller, route, argsBuilderBuilderArgs, MiddlewareType.response);
        await MiddlewareRunner.runGlobalMiddlewares(appInstance.__globalMiddlewares, argsBuilderBuilderArgs, GlobalMiddlewareType.afterResposeMiddlewares);

        Flowpress.resolveResponse(flowResponse, res);
      } catch (e) {
        Flowpress.handleError(e, res, route, catchError);
      }
    });

    return await new Promise<Flowpress>((resolve) => server.listen(appInstance.__port, () => resolve(flowpress)));
  }

  private static async parseRequestBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body: string = "";

      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          if(body !== undefined) resolve(JSON.parse(body));
          else resolve(undefined);
        } catch (err) {
          resolve(body);
        }
      });

      req.on('error', err => {
        reject(err);
      });
    });
  }

  private static resolveResponse(response: FlowResponse, res: http.ServerResponse) {
    const finalData = response.getData();

    if (finalData !== undefined) {
      const [header, content] = Flowpress.parseContent(finalData);
      response.setHeader("Content-Type", header);
      response.setData(content);
      response.setHeader("Content-Length", Buffer.byteLength(content));
    } else {
      response.setStatusCode(HttpStatus.NoContent);
    }

    res.writeHead(response.getStatusCode(), response.getHeaders());
    res.end(response.getData());
  }

  private static handleError(error: unknown, res: http.ServerResponse, route: Route, catchError?: (route: Route, e: unknown) => void) {
    if (error instanceof HttpException) {
      const response = new FlowResponse();

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
    } else {
      res.writeHead(HttpStatus.InternalServerError);
      res.end();

      if(!catchError) throw error;
      
      catchError(route, error);
    }
  }

  private static parseContent(content: any): [string, string] {
    let header: string;
    let response: string;

    if (typeof content !== "object") {
      header = "text/plain; charset=utf-8";
      response = String(content);
    } else {
      header = "application/json; charset=utf-8";
      response = JSON.stringify(content);
    }

    return [header, response];
  }
}
