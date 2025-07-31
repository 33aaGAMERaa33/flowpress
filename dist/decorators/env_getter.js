"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envApplyProperties = envApplyProperties;
exports.EnvProperty = EnvProperty;
const dotenv_1 = __importDefault(require("dotenv"));
const env_values_1 = require("../constants/metadata_keys/env_values");
dotenv_1.default.config({ quiet: true });
function envApplyProperties(instance) {
    // Pega os valores armazenados
    const envValues = Reflect.getMetadata(env_values_1.ENV_VALUES_METADATA_KEY, instance) ?? [];
    for (const [propertyKey, value] of envValues) {
        // Define o valor à instancia
        Object.defineProperty(instance, propertyKey, {
            value: value,
            writable: false,
        });
    }
}
function EnvProperty(params) {
    return function (target, propertyKey) {
        // Verifica se a propriedade decorada é estatica
        const isStatic = typeof target === "function";
        // Pega o valor do .env
        const value = getEnvValue(target, propertyKey, params);
        if (!isStatic) {
            // Pega os valores antes armazenados
            const envValues = Reflect.getMetadata(env_values_1.ENV_VALUES_METADATA_KEY, target) ?? [];
            // Adiciona o valor atual junto com a chave da propriedade
            envValues.push([propertyKey, value]);
            // Guarda os dados novamente
            Reflect.defineMetadata(env_values_1.ENV_VALUES_METADATA_KEY, envValues, target);
        }
        else {
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
function getEnvValue(target, propertyKey, params) {
    let envKey;
    const optional = params?.optional ?? false;
    // Valida os parametros
    if (typeof params === "object")
        envKey = params.key ?? propertyKey.toString();
    else if (typeof params === "string")
        envKey = params;
    else
        throw new Error("Os parametros são invalidos");
    const envValue = process.env[envKey];
    if (envValue === undefined && !optional)
        throw new Error(`Não foi possivel encontrar o valor de ${envKey} no .env`);
    // Variavel que contem o conteudo do valor de env já convertido para o tipo primitivo correspondente
    const value = ((value) => {
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
        if (!convertTypes.includes(type))
            throw new Error(`O tipo ${type.name} não em suportado pelo EnvGetter`);
        else {
            // Converte o tipo
            if (type !== Boolean)
                value = type(value);
            else {
                value = value === "true" ? true : false;
            }
            // Verifica se a converção foi bem sucedida
            if (!convertTypes.find((convertType) => convertType.name.toLowerCase() == typeof value))
                throw new Error(`Não foi possivel converter o valor de ${envKey} para ${type}`);
            return value;
        }
    })(envValue);
    return value;
}
