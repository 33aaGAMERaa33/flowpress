import { ClassConstructor } from "../defines/class_constructor";
import { InstanceImplicitImpl } from "../interfaces/instance.implicit.impl";

export class AppDeclarationService {
    private constructor(){}


    static instanceImplicitImplements<T extends InstanceImplicitImpl>(
        constructors: ClassConstructor[], 
        verifyBeforeInstance?: (
            classConstructor: ClassConstructor,
            jumpConstructor: () => void,   
        ) => void,
        verifyAfterInstance?: (
            instance: T,
            jumpConstructor: () => void,   
        ) => void,
    ) {
        const instances: T[] = [];

        // Intera sobre os construtores para instanciar as classes
        for(const constructor of constructors) {
            let jump = false;

            // Chama a função se tiver sido fornecida para fazer uma verifição no construtor antes de instanciar
            if(verifyBeforeInstance) verifyBeforeInstance(constructor, () => {
                jump = true;
            });
            
            // Pula se tiver sido requerido
            if(jump) continue;
            
            const instance = new constructor() as T;
            
            // Faz outra verificação porem dessa vez na instancia
            if(verifyAfterInstance) verifyAfterInstance(instance, () => {
                jump = true;
            });

            // Pula se tiver sido requerido
            if(jump) continue;

            instances.push(instance);
        }

        return instances;
    }
}