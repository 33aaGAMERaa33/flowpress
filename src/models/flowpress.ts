import { APP_METADATA_KEY } from "../constants/metadata_keys/app";
import { HttpException } from "../exceptions/http_exception";
import { AppImplicitImpl } from "../interfaces/app_instance.implicit.impl";
import http, { IncomingMessage } from "http";
import url from "url";
import { HttpMethod } from "../enums/http_method";
import { ResponseData } from "./response_data";
import { HttpStatus } from "../enums/http_status";
import { MiddlewaresDataContainer } from "./middlawares_data";
import { RouteResolver } from "./helpers/router_resolver";
import { MiddlewareRunner } from "./helpers/middleware_runner";
import { ArgsBuilder, ArgsBuilderBuilderArgs } from "./helpers/args_builder";
import { Route } from "./route";

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
        const response = new ResponseData();
        const body = await Flowpress.parseRequestBody(req);
        const middlawaresData = new MiddlewaresDataContainer();

        const argsBuilderBuilderArgs = {
            instance: controller,
            propertyKey: route.propertyKey,
            body: body,
            parsedUrl: parsedUrl,
            req: req,
            response: response,
            middlawaresData: middlawaresData,
        } as ArgsBuilderBuilderArgs;

        await MiddlewareRunner.runRequestMiddlewares(appInstance, controller, route, argsBuilderBuilderArgs);
        
        const args = ArgsBuilder.build(argsBuilderBuilderArgs);
        const handlerResult = await route.handler(...args);
        
        response.setData(handlerResult);

        await MiddlewareRunner.runResponseMiddlewares(appInstance, controller, route, argsBuilderBuilderArgs);

        Flowpress.resolveResponse(response, res);
      } catch (e) {
        Flowpress.handleError(e, res, route, catchError);
      }
    });

    return await new Promise<Flowpress>((resolve) => server.listen(appInstance.__port, () => resolve(flowpress)));
  }

  private static async parseRequestBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      let body: string |undefined = undefined;

      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          if(body !== undefined) resolve(JSON.parse(body));
          else resolve(undefined);
        } catch (err) {
          reject(err);
        }
      });

      req.on('error', err => {
        reject(err);
      });
    });
  }

  private static resolveResponse(response: ResponseData, res: http.ServerResponse) {
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
      const response = new ResponseData();

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
