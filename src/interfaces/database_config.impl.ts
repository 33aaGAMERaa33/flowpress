import { ClassConstructor } from "../defines/class_constructor";

export interface DatabaseConfigImpl {
    type: string,
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
    synchronize?: boolean,
    logging?: boolean,
    entities: ClassConstructor[],
}