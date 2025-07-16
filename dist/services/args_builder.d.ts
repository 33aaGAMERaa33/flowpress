import { IncomingMessage } from "http";
import { UrlWithParsedQuery } from "url";
import { MiddlewaresDataContainer } from "../models/middlawares_data";
import { ResponseData } from "../models/response_data";
import { InstanceImplicitImpl } from "../interfaces/instance.implicit.impl";
export declare class ArgsBuilder {
    private constructor();
    static build(data: ArgsBuilderBuilderArgs): any[];
}
export interface ArgsBuilderBuilderArgs {
    instance: InstanceImplicitImpl;
    propertyKey: string | symbol;
    req: IncomingMessage;
    response: ResponseData;
    parsedUrl: UrlWithParsedQuery;
    body: any;
    middlawaresData: MiddlewaresDataContainer;
}
