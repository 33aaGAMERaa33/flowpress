import { HttpMethod } from "../enums/http_method";
export type MethodDefine = [
    string | symbol,
    HttpMethod,
    string | undefined
];
export declare function Method(method: HttpMethod, path?: string): MethodDecorator;
