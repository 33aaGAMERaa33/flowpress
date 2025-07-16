"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = Module;
const controller_1 = require("../constants/metadata_keys/controller");
const injectable_1 = require("../constants/metadata_keys/injectable");
const module_1 = require("../constants/metadata_keys/module");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
const app_declaration_service_1 = require("../services/app_declaration.service");
const solve_injections_1 = require("../models/helpers/solve_injections");
function Module(data) {
    return function (constructor) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        const [controllers, injectables, exports] = [data.controllers ?? [], data.injectables ?? [], data.exports ?? []];
        const exportsInstance = [];
        // Instancia as classes injetaveis
        const injectablesInstances = app_declaration_service_1.AppDeclarationService.instanceImplicitImplements(injectables, (injectableConstructor) => {
            // Verifica se é realmente uma classe injetavel
            if (!Reflect.getMetadata(injectable_1.INJECTABLE_METADATA_KEY, injectableConstructor))
                throw new Error(`A classe ${injectableConstructor.name} não tem metadados de injetavel`);
        }, (instance) => {
            // Verifica pelo construtor se a instancia é para exportar
            if (exports.find((toExport) => instance.__originalConstructor === Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, toExport))) {
                exportsInstance.push(instance);
            }
        });
        // Instancia os controladores
        const controllersInstance = app_declaration_service_1.AppDeclarationService.instanceImplicitImplements(controllers, (controllerConstructor) => {
            // Verifica se é realmente um controlador
            if (!Reflect.getMetadata(controller_1.CONTROLLER_METADATA_KEY, controllerConstructor)) {
                throw new Error(`A classe ${controllerConstructor.name} não tem metadados de controlador`);
            }
        }, (controllerInstance) => {
            // Resolve as injeções pendentes com os injetaveis fornecidos
            solve_injections_1.SolveInjectionsService.solveInjectables(controllerInstance, injectablesInstances, {
                passResolved: false,
                ignoreNotResolved: true,
            });
        });
        Reflect.defineMetadata(module_1.MODULE_METADATA_KEY, true, originalConstructor);
        const newConstructor = class extends constructor {
            __originalConstructor = originalConstructor;
            __controllers = controllersInstance;
            __exports = exportsInstance;
        };
        // Guarda o construtor original em metadados no novo construtor
        Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        return newConstructor;
    };
}
