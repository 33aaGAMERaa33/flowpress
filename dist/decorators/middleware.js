"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = Middleware;
const middelware_1 = require("../constants/metadata_keys/middelware");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
function Middleware(constructor) {
    const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
    Reflect.defineMetadata(middelware_1.MIDDLEWARE_METADATA_KEY, true, originalConstructor);
    const newConstructor = class extends constructor {
        __originalConstructor = originalConstructor;
    };
    // Guarda o construtor original em metadados no novo construtor
    Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
    return newConstructor;
}
