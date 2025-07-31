import { HttpMethod } from "../enums/http_method";

export class Route {
    readonly path?: string;
    readonly method: HttpMethod;
    readonly propertyKey: string | symbol;
    readonly handler: (...args: any[]) => any;
    
    constructor(data: RouteConstructor) {
        this.path = data.path;
        this.method = data.method;
        this.handler = data.handler;
        this.propertyKey = data.propertyKey;
    }
}

export interface RouteConstructor {
    path?: string;
    method: HttpMethod;
    propertyKey: string | symbol;
    handler: (...args: any[]) => any;
}