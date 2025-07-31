"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
class Route {
    path;
    method;
    propertyKey;
    handler;
    constructor(data) {
        this.path = data.path;
        this.method = data.method;
        this.handler = data.handler;
        this.propertyKey = data.propertyKey;
    }
}
exports.Route = Route;
