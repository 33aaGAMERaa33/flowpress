type Params = Params1 | Params2;
type Params1 = string;
type Params2 = {
    key?: string;
    optional?: boolean;
};
export declare function envApplyProperties(instance: any): void;
export declare function EnvProperty(params?: Params): PropertyDecorator;
export {};
