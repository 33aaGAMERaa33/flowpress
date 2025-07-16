import { ControllerImplicitImpl } from "./controller.implicit.impl";
import { InstanceImplicitImpl } from "./instance.implicit.impl";
import { MiddlewareImplicitImpl } from "./middleware.implicit.impl";
import { DataSource } from "typeorm";

export interface AppImplicitImpl extends InstanceImplicitImpl {
    __port: number;
    __dataSource?: DataSource;
    __onLoaded?: Promise<void>;
    __controllers: ControllerImplicitImpl[];
    __middlawares: MiddlewareImplicitImpl[];
}