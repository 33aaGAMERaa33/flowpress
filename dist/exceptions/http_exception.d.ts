import { HttpStatus } from "../enums/http_status";
export declare class HttpException {
    readonly status: HttpStatus;
    readonly message?: any;
    readonly error?: Object;
    constructor(status: HttpStatus, message?: any, error?: Object);
}
