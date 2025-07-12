import { HttpStatus } from "../enums/http_status";

export class HttpException {
    readonly status: HttpStatus;
    readonly message?: any;
    readonly error?: Object;

    constructor(status: HttpStatus, message?: any, error?: Object) {
        this.status = status;
        this.error = error;
        this.message = message;
    }
}