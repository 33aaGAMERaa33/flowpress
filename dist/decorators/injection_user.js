"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectionUser = InjectionUser;
const instances_pending_injections_1 = require("../constants/metadata_keys/instances_pending_injections");
const app_config_1 = require("./app_config");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
function InjectionUser() {
    return function (constructor) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        // Implementa de forma implicita InstanceImpl pois o construtor que guarda os dados essenciais para a injeção
        const newConstructor = class extends constructor {
            __originalConstructor = originalConstructor;
            constructor(...args) {
                super(...args);
                // Pega a fila de injeção de dependencia
                const instancesPedingInjections = Reflect.getMetadata(instances_pending_injections_1.INSTANCES_PENDING_INJECTIONS, app_config_1.AppConfig) ?? [];
                // Verifica se a instancia já foi adicionada a fila de injeção de dependencia, se não foi adiciona
                if (!instancesPedingInjections.includes(this)) {
                    // Adiciona a instancia à fila de injeção
                    instancesPedingInjections.push(this);
                    // Guarda essa fila com a instancia adicionada nos metadados de AppDeclaration
                    Reflect.defineMetadata(instances_pending_injections_1.INSTANCES_PENDING_INJECTIONS, instancesPedingInjections, app_config_1.AppConfig);
                }
            }
        };
        // Guarda o construtor original em metadados no novo construtor
        Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        return newConstructor;
    };
}
