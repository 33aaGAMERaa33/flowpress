import { HttpStatus } from "../enums/http_status";

export class HttpException {
    readonly status: HttpStatus;
    readonly error?: Object;
    readonly message?: string;

    constructor(status: HttpStatus, error?: Object, message?: string) {
        this.status = status;
        this.error = error;
        this.message = message;
    }
}