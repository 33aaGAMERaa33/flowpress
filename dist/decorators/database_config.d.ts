import { ClassConstructor } from "../defines/class_constructor";
import { DatabaseConfigImpl } from "../interfaces/database_config.impl";
export declare function DataSourceConfig<T extends ClassConstructor<DatabaseConfigImpl>>(construtor: T): {
    new (...args: any[]): {
        readonly __originalConstructor: ClassConstructor;
        type: string;
        host: string;
        port: number;
        username: string;
        password: string;
        database: string;
        synchronize?: boolean;
        logging?: boolean;
        entities: Object[];
    };
} & T;
