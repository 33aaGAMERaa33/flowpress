import { HttpMethod } from "../enums/http_method";
export declare class Route {
    readonly path?: string;
    readonly method: HttpMethod;
    readonly propertyKey: string | symbol;
    readonly handler: (...args: any[]) => any;
    constructor(data: RouteConstructor);
}
export interface RouteConstructor {
    path?: string;
    method: HttpMethod;
    propertyKey: string | symbol;
    handler: (...args: any[]) => any;
}
