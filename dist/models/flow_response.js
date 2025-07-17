"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowResponse = void 0;
class FlowResponse {
    data;
    status = 200;
    headers = {};
    setData(data) {
        this.data = data;
    }
    getData() {
        return this.data;
    }
    setStatusCode(status) {
        this.status = status;
    }
    getStatusCode() {
        return this.status;
    }
    setHeaders(headers) {
        for (const key in headers) {
            this.headers[key.toLowerCase()] = headers[key];
        }
    }
    getHeaders() {
        return this.headers;
    }
    setHeader(key, value) {
        this.headers[key.toLowerCase()] = value;
    }
    getHeader(key) {
        return this.headers[key.toLowerCase()];
    }
}
exports.FlowResponse = FlowResponse;
