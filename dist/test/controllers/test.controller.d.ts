export declare class TestController {
    private readonly testService;
    test(): Promise<{
        status: string;
        message: string;
    }>;
}
