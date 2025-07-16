import { ClassConstructor } from "../defines/class_constructor";
export declare class MiddlewareData {
    private readonly middlewareConstructor;
    private data;
    constructor(middlewareConstructor: ClassConstructor);
    setData(data?: any): void;
    getData(): any;
    getMiddleware(): ClassConstructor;
}
