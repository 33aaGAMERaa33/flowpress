export declare class Flowpress {
    private readonly app;
    private constructor();
    get port(): number;
    static start(app: any): Promise<Flowpress>;
    private static parseRequestBody;
    private static resolveResponse;
    private static handleError;
    private static parseContent;
}
