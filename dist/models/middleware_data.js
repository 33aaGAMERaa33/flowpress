"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareData = void 0;
class MiddlewareData {
    middlewareConstructor;
    data;
    constructor(middlewareConstructor) {
        this.middlewareConstructor = middlewareConstructor;
    }
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    getMiddleware() {
        return this.middlewareConstructor;
    }
}
exports.MiddlewareData = MiddlewareData;
