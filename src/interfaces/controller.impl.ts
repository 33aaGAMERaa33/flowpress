import { Route } from "../models/route";
import { InstanceImpl } from "./instance.impl";

export interface ControllerImpl extends InstanceImpl {
    __routes: Route[];
    __controller?: string;
}