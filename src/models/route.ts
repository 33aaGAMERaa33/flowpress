import { HttpMethod } from "../enums/http_method";

export class Route {
    readonly path: string;
    readonly method: HttpMethod;
    readonly propertyKey: string | symbol;
    readonly handler: (...args: any[]) => any;

    constructor(data: RouteConstructor) {
        this.path = data.path;
        this.method = data.method;
        this.propertyKey = data.propertyKey;
        this.handler = data.handler;
    }
}

export interface RouteConstructor {
    path: string;
    method: HttpMethod;
    propertyKey: string | symbol;
    handler: (...args: any[]) => any;
}