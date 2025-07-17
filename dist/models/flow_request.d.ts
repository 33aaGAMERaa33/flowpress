import http from "http";
import url from "url";
export declare class FlowRequest {
    private readonly url;
    private readonly req;
    constructor(req: http.IncomingMessage);
    getUrl(): url.UrlWithParsedQuery;
    getHeaders(): http.IncomingHttpHeaders;
    getHeader(header: string): string | string[] | number | undefined;
}
