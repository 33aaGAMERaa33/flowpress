import { ControllerImplicitImpl } from "./controller.implicit.impl";
import { InjectableImplicitImpl } from "./injectable.implicit.impl";
import { InstanceImplicitImpl } from "./instance.implicit.impl";

export interface ModuleImplicitImpl extends InstanceImplicitImpl {
    readonly __controllers: ControllerImplicitImpl[];
    readonly __exports: InjectableImplicitImpl[];
}