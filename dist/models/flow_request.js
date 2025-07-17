"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowRequest = void 0;
class FlowRequest {
    req;
    constructor(req) {
        this.req = req;
    }
    getHeaders() {
        return this.req.headers;
    }
    getHeader(header) {
        return this.getHeaders()[header];
    }
}
exports.FlowRequest = FlowRequest;
