"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowRequest = void 0;
const url_1 = __importDefault(require("url"));
class FlowRequest {
    url;
    req;
    constructor(req) {
        this.url = url_1.default.parse(req.url ?? "", true);
        this.req = req;
    }
    getUrl() {
        return this.url;
    }
    getHeaders() {
        return this.req.headers;
    }
    getHeader(header) {
        return this.getHeaders()[header];
    }
}
exports.FlowRequest = FlowRequest;
