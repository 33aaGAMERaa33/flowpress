"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = Method;
const controller_methods_1 = require("../constants/metadata_keys/controller_methods");
function Method(method, path) {
    return function (target, propertyKey, _) {
        // Pega as definições dos metodos de rota antes guardados
        const methodsDefine = Reflect.getMetadata(controller_methods_1.CONTROLLER_METHODS_METADATA_KEY, target.constructor) ?? [];
        // Adiciona a nova definição
        methodsDefine.push([propertyKey, method, path]);
        // Guarda em metadados na classe
        Reflect.defineMetadata(controller_methods_1.CONTROLLER_METHODS_METADATA_KEY, methodsDefine, target.constructor);
    };
}
