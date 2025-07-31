"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseMiddlaware = UseMiddlaware;
const use_middlaware_1 = require("../constants/metadata_keys/use_middlaware");
function UseMiddlaware(middlaware, canCancel) {
    return function (target, propertyKey, _) {
        // Pega as definições de middlawares que vai ser usado
        const useMiddlawaresDefine = Reflect.getMetadata(use_middlaware_1.USE_MIDDLAWARE_METADATA_KEY, target.constructor) ?? {};
        // Instancia a lista caso não esteja
        useMiddlawaresDefine[propertyKey] ??= [];
        // Adiciona o construtor do middlaware
        useMiddlawaresDefine[propertyKey].push(middlaware);
        // Guarda em metadados no construtor
        Reflect.defineMetadata(use_middlaware_1.USE_MIDDLAWARE_METADATA_KEY, useMiddlawaresDefine, target.constructor);
    };
}
