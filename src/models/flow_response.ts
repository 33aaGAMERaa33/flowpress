import { HttpStatus } from "../enums/http_status";
import http from "http";

export class FlowResponse {
    private data: any;
    private status: number = 200;
    private headers: http.OutgoingHttpHeaders = {};

    setData(data: any) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    setStatusCode(status: HttpStatus) {
        this.status = status;
    }

    getStatusCode() {
        return this.status;
    }

    setHeaders(headers: http.OutgoingHttpHeaders) {
        for(const key in headers) {
            this.headers[key.toLowerCase()] = headers[key];
        }
    }

    getHeaders() {
        return this.headers;
    }

    setHeader(key: string, value: string | number | undefined) {
        this.headers[key.toLowerCase()] = value;
    }

    getHeader(key: string) {
        return this.headers[key.toLowerCase()];
    }
}