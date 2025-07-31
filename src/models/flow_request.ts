import http from "http";
import url from "url";

export class FlowRequest {
    private readonly url: url.UrlWithParsedQuery
    private readonly req: http.IncomingMessage;

    constructor(req: http.IncomingMessage) {
        this.url = url.parse(req.url ?? "", true);
        this.req = req;
    }

    getUrl() {
        return this.url;
    }

    getHeaders(): http.IncomingHttpHeaders{
        return this.req.headers;
    }

    getHeader(header: string): string | string[] | number | undefined {
        return this.getHeaders()[header];
    }
}