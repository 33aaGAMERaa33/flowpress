import { AppImpl } from "./app.impl";
import { ControllerImpl } from "./controller.impl";
import { InstanceImpl } from "./instance.impl";
import { MiddlawareImpl } from "./middlaware.impl";

export interface AppInstanceImpl extends AppImpl, InstanceImpl{
    __controllers: ControllerImpl[];
    __middlawares: MiddlawareImpl[];
}