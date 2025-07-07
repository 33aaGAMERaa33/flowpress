import { ClassConstructor } from "../defines/class_constructor";
import { ControllerImpl } from "../interfaces/controller.impl";
import { CONTROLLER_METADATA_KEY } from "../metadata_keys/controller";
import { CONTROLLER_METHODS_METADATA_KEY } from "../metadata_keys/controller_methods";
import { Route } from "../models/route";
import { MethodDefine } from "./method";

export function Controller(controller?: string) {
    return function<T extends ClassConstructor>(constructor: T) {
        const routes: Route[] = [];
        // Pega os metodos de rota antes definidos pelo decorador @Method 
        const methodsDefine: MethodDefine[] = Reflect.getMetadata(CONTROLLER_METHODS_METADATA_KEY, constructor.prototype) ?? [];

        // Função para formatar o caminho
        function adaptPath(path?: string) {
            return `${path ? `/${path}` : ""}`;
        }
        
        // Intera sobre os methodsDefine para instanciar as rotas
        for(const [propertyKey, httpMethod, path] of methodsDefine) {
            // Formata o caminho adicionando junto o controlador como prefixo
            const newPath = `${adaptPath(controller)}${adaptPath(path)}`;

            // Procura outra rota igual, se achar gera um erro em tempo de execução
            if(routes.find((otherRoute) => otherRoute.path === newPath && otherRoute.method === httpMethod))
                throw new Error(`Rotas duplicadas em ${constructor.name} para ${path} via ${httpMethod}`);

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
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, true, constructor);

        // Implementa implicitamente ControllerImpl para guardar valores essenciais
        return class extends constructor implements ControllerImpl {
            readonly __routes: Route[] = [];
            readonly __constructor: ClassConstructor = constructor;
            readonly __controller?: string | undefined = controller;

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
        }
    }
}