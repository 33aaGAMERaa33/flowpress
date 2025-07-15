import { RequestParam } from "../enums/request_param";
export type RequestParamBinding = [RequestParam, number];
export declare const Body: () => ParameterDecorator;
export declare const Query: () => ParameterDecorator;
export declare const Res: () => ParameterDecorator;
export declare const Headers: () => ParameterDecorator;
