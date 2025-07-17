import http from "http";
export declare class FlowRequest {
    private readonly req;
    constructor(req: http.IncomingMessage);
    getHeaders(): http.IncomingHttpHeaders;
    getHeader(header: string): string | string[] | number | undefined;
}
