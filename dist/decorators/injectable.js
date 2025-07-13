"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = Injectable;
const injectable_1 = require("../constants/metadata_keys/injectable");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
function Injectable() {
    return function (constructor) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        // Define que é injetavel
        Reflect.defineMetadata(injectable_1.INJECTABLE_METADATA_KEY, true, originalConstructor);
        // Implementa a injectable de forma implicita
        const newConstructor = class extends constructor {
            __originalConstructor = originalConstructor;
            constructor(...args) {
                super(...args);
            }
        };
        // Guarda o construtor original em metadados no novo construtor
        Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        return newConstructor;
    };
}
