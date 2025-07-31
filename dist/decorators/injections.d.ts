import { InjectionType } from "../enums/injection_type.enum";
export type InjectDefine = [InjectionType, string | symbol, any];
export declare const Inject: () => PropertyDecorator;
export declare const InjectRepository: (entity: Object) => PropertyDecorator;
