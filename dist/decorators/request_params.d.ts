import { RequestParam } from "../enums/request_param";
export type MethodsRequestParamsDefine = Record<string | symbol, RequestParamBinding[]>;
export type RequestParamBinding = [RequestParam, number];
export declare const Body: () => ParameterDecorator;
export declare const Query: () => ParameterDecorator;
export declare const Res: () => ParameterDecorator;
export declare const Headers: () => ParameterDecorator;
export declare const MiddlewaresData: () => ParameterDecorator;
