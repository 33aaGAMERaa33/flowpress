"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceConfig = DataSourceConfig;
const database_config_1 = require("../constants/metadata_keys/database_config");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
function DataSourceConfig(construtor) {
    // Pega o construtor original
    const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, construtor) ?? construtor;
    // Cria um novo construtor para implementar de forma implicita dados essenciais
    const newConstructor = class extends construtor {
        __originalConstructor = originalConstructor;
        constructor(...args) {
            super(...args);
        }
    };
    // Guarda o construtor original
    Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
    Reflect.defineMetadata(database_config_1.DATABASE_CONFIG_METADATA_KEY, true, originalConstructor);
    return newConstructor;
}
