import { InjectableImplicitImpl } from "../../interfaces/injectable.implicit.impl";
import { InstanceImplicitImpl } from "../../interfaces/instance.implicit.impl";
import { DataSource } from "typeorm";
export declare class SolveInjectionsService {
    private constructor();
    static solveInjectables<T extends InstanceImplicitImpl>(instance: T, injectables: InjectableImplicitImpl[], data: {
        passResolved: boolean;
        ignoreNotResolved: boolean;
    }): void;
    static solveRepositories<T extends InstanceImplicitImpl>(instance: T, dataSource?: DataSource): void;
}
