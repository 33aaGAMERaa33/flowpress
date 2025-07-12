import { ClassConstructor } from "../defines/class_constructor";
import { ControllerImplicitImpl } from "../interfaces/controller.implicit.impl";
import { CONTROLLER_METADATA_KEY } from "../constants/metadata_keys/controller";
import { CONTROLLER_METHODS_METADATA_KEY } from "../constants/metadata_keys/controller_methods";
import { MethodDefine } from "./method";
import { ORIGINAL_CONSTRUCTOR_METADATA_KEY } from "../constants/metadata_keys/original-constructor";
import { Route } from "../models/route";

export function Controller() {
    return function<T extends ClassConstructor>(constructor: T) {
        // Pega o construtor original guardado caso houver
        const originalConstructor = Reflect.getMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, constructor) ?? constructor;

        const routes: Route[] = [];
        // Pega os metodos de rota antes definidos pelo decorador @Method 
        const methodsDefine: MethodDefine[] = Reflect.getMetadata(CONTROLLER_METHODS_METADATA_KEY, originalConstructor) ?? [];
        
        // Intera sobre os methodsDefine para instanciar as rotas
        for(const [propertyKey, httpMethod, path] of methodsDefine) {
            // Formata o caminho adicionando junto o controlador como prefixo
            const tempPath = `${path ? path : ""}`;
            const newPath = tempPath.startsWith("/") ? tempPath : `/${tempPath}`;

            // Procura outra rota igual, se achar gera um erro em tempo de execução
            if(routes.find((otherRoute) => otherRoute.path === newPath && otherRoute.method === httpMethod))
                throw new Error(`Rotas duplicadas em ${originalConstructor.name} para ${path} via ${httpMethod}`);

            // Adiciona a rota com um handler predefinido que caso seja chamado antes de ser vinculado a instancia vai gerar um erro
            routes.push(new Route({
                path: newPath,
                method: httpMethod,
                propertyKey: propertyKey,
                handler: () => {
                    throw new Error(`Handler para ${propertyKey.toString()} ainda não está vinculado.`);
                }
            }));
        }

        // Define que a classe é um controlador
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, true, originalConstructor);

        // Implementa implicitamente ControllerImpl para guardar valores essenciais
        const newConstructor = class extends constructor implements ControllerImplicitImpl {
            readonly __routes: Route[] = [];
            readonly __originalConstructor: ClassConstructor = originalConstructor;

            constructor(...args: any[]) {
                super(...args);

                // Intera sobre as rotas para finalmente vincular o handler de rota à instancia
                routes.forEach((route) => {
                    // Cria uma nova instancia de rota para vincular o handler à instancia
                    const newRoute = new Route({
                        method: route.method,
                        path: route.path,
                        propertyKey: route.propertyKey,
                        handler: (this as any)[route.propertyKey].bind(this),
                    });

                    // Guarda a rota
                    this.__routes.push(newRoute);
                });
            }
        };

        // Guarda o construtor original
        Reflect.defineMetadata(ORIGINAL_CONSTRUCTOR_METADATA_KEY, originalConstructor, newConstructor);

        // Retorna o novo construtor
        return newConstructor;
    }
}