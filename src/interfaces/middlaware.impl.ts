import { InstanceImpl } from "./instance.impl";

export interface MiddlawareImpl extends InstanceImpl {
    handler(...args: any[]): any;
}