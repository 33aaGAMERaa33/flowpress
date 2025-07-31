import { Route } from "../models/route";
import { InstanceImplicitImpl } from "./instance.implicit.impl";
export interface ControllerImplicitImpl extends InstanceImplicitImpl {
    __routes: Route[];
}
