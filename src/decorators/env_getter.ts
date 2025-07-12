import dotenv from "dotenv";
import { ENV_VALUES_METADATA_KEY } from "../constants/metadata_keys/env_values";

type Params = Params1 | Params2;
type Params1 = string;
type Params2 = {
    key?: string;
    optional?: boolean;
};

type EnvValue = [string | symbol, any];

dotenv.config({quiet: true});

export function envApplyProperties(instance: any) {
    // Pega os valores armazenados
    const envValues: EnvValue[] = Reflect.getMetadata(ENV_VALUES_METADATA_KEY, instance) ?? [];

    for(const [propertyKey, value] of envValues) {
        // Define o valor à instancia
        Object.defineProperty(instance, propertyKey, {
            value: value,
            writable: false,
        });
    }
}

export function EnvProperty(params?: Params): PropertyDecorator {
    return function (target: any, propertyKey: string | symbol) {
        // Verifica se a propriedade decorada é estatica
        const isStatic = typeof target === "function";

        // Pega o valor do .env
        const value = getEnvValue(target, propertyKey, params);

        if(!isStatic) {
            // Pega os valores antes armazenados
            const envValues: EnvValue[] = Reflect.getMetadata(ENV_VALUES_METADATA_KEY, target) ?? [];

            // Adiciona o valor atual junto com a chave da propriedade
            envValues.push([propertyKey, value]);

            // Guarda os dados novamente
            Reflect.defineMetadata(ENV_VALUES_METADATA_KEY, envValues, target);
        }else {
            // Define diretamente o valor a propriedade
            Object.defineProperty(target, propertyKey, {
                value: value,
                writable: false,
                enumerable: true,
                configurable: false,
            });
        }
    };
}

function getEnvValue(target: Object, propertyKey: string | symbol, params?: Params) {
    let envKey: string;
    const optional = (params as Params2)?.optional ?? false;

    // Valida os parametros
    if(typeof params === "object") envKey = params.key ?? propertyKey.toString();
    else if(typeof params === "string") envKey = params;
    else throw new Error("Os parametros são invalidos");

    const envValue = process.env[envKey];

    if(envValue === undefined && !optional) 
        throw new Error(`Não foi possivel encontrar o valor de ${envKey} no .env`);

    // Variavel que contem o conteudo do valor de env já convertido para o tipo primitivo correspondente
    const value = ((value: any) => {
        // Pega o tipo da propriedade
        const type = Reflect.getMetadata("design:type", target, propertyKey);
        // Lista os tipos suportados
        const convertTypes = [
            Number,
            String,
            Boolean,
        ];
        
        // Verifica se o tipo da propriedade é suportado
        // Se for suportado converte diretamente para ela
        if(!convertTypes.includes(type)) throw new Error(`O tipo ${type.name} não em suportado pelo EnvGetter`);
        else {
            // Converte o tipo
            if(type !== Boolean) value = type(value);
            else {
                value = value === "true" ? true : false;
            }

            // Verifica se a converção foi bem sucedida
            if(!convertTypes.find((convertType) => convertType.name.toLowerCase() == typeof value)) 
                throw new Error(`Não foi possivel converter o valor de ${envKey} para ${type}`);

            return value;
        }
    })(envValue);

    return value;
}