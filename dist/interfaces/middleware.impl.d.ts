export interface MiddlewareImpl {
    handler(...args: any[]): Promise<void> | void;
}
