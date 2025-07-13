import { ClassConstructor } from "../defines/class_constructor";
import { InstanceImplicitImpl } from "../interfaces/instance.implicit.impl";
export declare class AppDeclarationService {
    private constructor();
    static instanceImplicitImplements<T extends InstanceImplicitImpl>(constructors: ClassConstructor[], verifyBeforeInstance?: (classConstructor: ClassConstructor, jumpConstructor: () => void) => void, verifyAfterInstance?: (instance: T, jumpConstructor: () => void) => void): T[];
}
