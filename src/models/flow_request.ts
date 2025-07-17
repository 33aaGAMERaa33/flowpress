import http from "http";

export class FlowRequest {
    private readonly req: http.IncomingMessage;

    constructor(req: http.IncomingMessage) {
        this.req = req;
    }

    getHeaders(): http.IncomingHttpHeaders{
        return this.req.headers;
    }

    getHeader(header: string): string | string[] | number | undefined {
        return this.getHeaders()[header];
    }
}