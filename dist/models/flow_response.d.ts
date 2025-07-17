import { HttpStatus } from "../enums/http_status";
import http from "http";
export declare class FlowResponse {
    private data;
    private status;
    private headers;
    setData(data: any): void;
    getData(): any;
    setStatusCode(status: HttpStatus): void;
    getStatusCode(): number;
    setHeaders(headers: http.OutgoingHttpHeaders): void;
    getHeaders(): http.OutgoingHttpHeaders;
    setHeader(key: string, value: string | number | undefined): void;
    getHeader(key: string): http.OutgoingHttpHeader | undefined;
}
