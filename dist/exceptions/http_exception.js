"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = void 0;
class HttpException {
    status;
    message;
    error;
    constructor(status, message, error) {
        this.status = status;
        this.error = error;
        this.message = message;
    }
}
exports.HttpException = HttpException;
