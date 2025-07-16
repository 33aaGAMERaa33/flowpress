"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewaresDataContainer = void 0;
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
class MiddlewaresDataContainer {
    middlewaresData = [];
    getMiddlawareData(middlewareConstructor) {
        const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, middlewareConstructor) ?? middlewareConstructor.constructor;
        let middlewareData = this.middlewaresData.find((middlewareData) => {
            const otherMiddlawareOriginalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, middlewareData) ?? middlewareData.getMiddleware();
            return originalConstructor === otherMiddlawareOriginalConstructor;
        });
        return middlewareData;
    }
}
exports.MiddlewaresDataContainer = MiddlewaresDataContainer;
