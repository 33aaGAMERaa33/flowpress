"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDeclarationService = void 0;
class AppDeclarationService {
    constructor() { }
    static instanceImplicitImplements(constructors, verifyBeforeInstance, verifyAfterInstance) {
        const instances = [];
        // Intera sobre os construtores para instanciar as classes
        for (const constructor of constructors) {
            let jump = false;
            // Chama a função se tiver sido fornecida para fazer uma verifição no construtor antes de instanciar
            if (verifyBeforeInstance)
                verifyBeforeInstance(constructor, () => {
                    jump = true;
                });
            // Pula se tiver sido requerido
            if (jump)
                continue;
            const instance = new constructor();
            // Faz outra verificação porem dessa vez na instancia
            if (verifyAfterInstance)
                verifyAfterInstance(instance, () => {
                    jump = true;
                });
            // Pula se tiver sido requerido
            if (jump)
                continue;
            instances.push(instance);
        }
        return instances;
    }
}
exports.AppDeclarationService = AppDeclarationService;
