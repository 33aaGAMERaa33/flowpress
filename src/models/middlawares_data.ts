import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../constants/metadata_keys/original-constructor";
import { ClassConstructor } from "../defines/class_constructor";
import { GlobalMiddlewareImpl } from "../interfaces/global_middleware.impl";
import { MiddlewareImpl } from "../interfaces/middleware.impl";
import { MiddlewareData } from "./middleware_data";

export class MiddlewaresDataContainer {
    readonly middlewaresData: MiddlewareData[] = [];
    
    getMiddlawareData<T extends MiddlewareImpl | GlobalMiddlewareImpl>(middlewareConstructor: ClassConstructor<T>): MiddlewareData | undefined {
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, middlewareConstructor) ?? middlewareConstructor.constructor;
        
        let middlewareData: MiddlewareData | undefined = this.middlewaresData.find((middlewareData) => {
            const otherMiddlawareOriginalConstructor = Reflect.getMetadata(
                ORIGINAL_CONSTRUCTOR_METADATA_KEY, 
                middlewareData
            ) ?? middlewareData.getMiddleware();

            return originalConstructor === otherMiddlawareOriginalConstructor;
        });

        return middlewareData;
    }
}