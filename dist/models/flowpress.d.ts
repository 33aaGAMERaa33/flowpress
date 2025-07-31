import { Route } from "./route";
export declare class Flowpress {
    private readonly app;
    private constructor();
    get port(): number;
    static start(app: any, catchError?: (route: Route, e: unknown) => void): Promise<Flowpress>;
    private static parseRequestBody;
    private static resolveResponse;
    private static handleError;
    private static parseContent;
}
