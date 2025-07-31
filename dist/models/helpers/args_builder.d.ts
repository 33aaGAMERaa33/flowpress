import { UrlWithParsedQuery } from "url";
import { MiddlewaresDataContainer } from "../middlawares_data";
import { FlowResponse } from "../flow_response";
import { InstanceImplicitImpl } from "../../interfaces/instance.implicit.impl";
import { FlowRequest } from "../flow_request";
export declare class ArgsBuilder {
    private constructor();
    static build(data: ArgsBuilderBuilderArgs): any[];
}
export interface ArgsBuilderBuilderArgs {
    instance: InstanceImplicitImpl;
    propertyKey: string | symbol;
    request: FlowRequest;
    response: FlowResponse;
    parsedUrl: UrlWithParsedQuery;
    body: any;
    middlawaresData: MiddlewaresDataContainer;
}
