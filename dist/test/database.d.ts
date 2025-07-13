import { ClassConstructor } from "../defines/class_constructor";
import { DatabaseConfigImpl } from "../interfaces/database_config.impl";
export declare class AppDatabase implements DatabaseConfigImpl {
    constructor();
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    synchronize?: boolean;
    logging?: boolean | undefined;
    entities: ClassConstructor[];
}
