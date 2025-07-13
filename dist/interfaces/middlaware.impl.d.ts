export interface MiddlawareImpl {
    handler(req: Request, res: Response, next: () => void): Promise<void> | void;
}
