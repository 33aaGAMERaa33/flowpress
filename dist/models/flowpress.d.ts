export declare class Flowpress {
    private readonly app;
    private constructor();
    get port(): number;
    private getRouteHandler;
    static start(app: any): Promise<Flowpress>;
    private static parseContent;
    private static parseRequestBody;
}
