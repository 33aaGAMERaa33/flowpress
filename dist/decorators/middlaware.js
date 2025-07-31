"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middalware = Middalware;
const middalware_1 = require("../constants/metadata_keys/middalware");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
function Middalware(constructor) {
    const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
    Reflect.defineMetadata(middalware_1.MIDDLAWARE_METADATA_KEY, true, originalConstructor);
    const newConstructor = class extends constructor {
        __originalConstructor = originalConstructor;
    };
    // Guarda o construtor original em metadados no novo construtor
    Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
    return newConstructor;
}
