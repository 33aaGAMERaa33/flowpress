import { ClassConstructor } from "../defines/class_constructor";

export class MiddlewareData {
    private readonly middlewareConstructor: ClassConstructor;
    private data: any;
    
    constructor(middlewareConstructor: ClassConstructor) {
        this.middlewareConstructor = middlewareConstructor;
    }

    setData(data?: any) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    getMiddleware(): ClassConstructor {
        return this.middlewareConstructor;
    }
}