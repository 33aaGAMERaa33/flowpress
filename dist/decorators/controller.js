"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = Controller;
const controller_1 = require("../constants/metadata_keys/controller");
const controller_methods_1 = require("../constants/metadata_keys/controller_methods");
const original_constructor_1 = require("../constants/metadata_keys/original-constructor");
const route_1 = require("../models/route");
function Controller() {
    return function (constructor) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;
        const routes = [];
        // Pega os metodos de rota antes definidos pelo decorador @Method 
        const methodsDefine = Reflect.getMetadata(controller_methods_1.CONTROLLER_METHODS_METADATA_KEY, originalConstructor) ?? [];
        // Intera sobre os methodsDefine para instanciar as rotas
        for (const [propertyKey, httpMethod, path] of methodsDefine) {
            // Formata o caminho adicionando junto o controlador como prefixo
            const tempPath = `${path ? path : ""}`;
            const newPath = tempPath.startsWith("/") ? tempPath : `/${tempPath}`;
            // Procura outra rota igual, se achar gera um erro em tempo de execução
            if (routes.find((otherRoute) => otherRoute.path === newPath && otherRoute.method === httpMethod))
                throw new Error(`Rotas duplicadas em ${originalConstructor.name} para ${path} via ${httpMethod}`);
            // Adiciona a rota com um handler predefinido que caso seja chamado antes de ser vinculado a instancia vai gerar um erro
            routes.push(new route_1.Route({
                path: newPath,
                method: httpMethod,
                propertyKey: propertyKey,
                handler: () => {
                    throw new Error(`Handler para ${propertyKey.toString()} ainda não está vinculado.`);
                }
            }));
        }
        // Define que a classe é um controlador
        Reflect.defineMetadata(controller_1.CONTROLLER_METADATA_KEY, true, originalConstructor);
        // Implementa implicitamente ControllerImpl para guardar valores essenciais
        const newConstructor = class extends constructor {
            __routes = [];
            __originalConstructor = originalConstructor;
            constructor(...args) {
                super(...args);
                // Intera sobre as rotas para finalmente vincular o handler de rota à instancia
                routes.forEach((route) => {
                    // Cria uma nova instancia de rota para vincular o handler à instancia
                    const newRoute = new route_1.Route({
                        method: route.method,
                        path: route.path,
                        propertyKey: route.propertyKey,
                        handler: this[route.propertyKey].bind(this),
                    });
                    // Guarda a rota
                    this.__routes.push(newRoute);
                });
            }
        };
        // Guarda o construtor original
        Reflect.defineMetadata(original_constructor_1.ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);
        // Retorna o novo construtor
        return newConstructor;
    };
}
