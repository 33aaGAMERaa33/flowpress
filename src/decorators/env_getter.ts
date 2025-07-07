import dotenv from "dotenv";

type Params1 = string;
type Params2 = {
    key?: string;
    optional?: boolean;
};

dotenv.config({quiet: true});

export function EnvGetter(params?: Params1 | Params2): PropertyDecorator {
    return function(target, propertyKey) {
        let envKey: string;
        const optional = (params as Params2).optional ?? false;

        // Valida os parametros
        if(typeof params === "object") envKey = params.key ?? propertyKey.toString();
        else if(typeof params === "string") envKey = params;
        else throw new Error("Os parametros são invalidos");

        const envValue = process.env[envKey];

        if(envKey === undefined && !optional) 
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
            if(!convertTypes.includes(type)) throw new Error(`O tipo ${type} não em suportado pelo EnvGetter`);
            else {
                // Converte o tipo
                value = type(value);

                // Verifica se a converção foi bem sucedida
                if(!convertTypes.find((convertType) => convertType.name.toLowerCase() == typeof value)) 
                    throw new Error(`Não foi possivel converter o valor de ${envKey} para ${type}`);

                return value;
            }
        })(envValue);

        // Define os valores estaticamente
        Object.defineProperty(target, propertyKey, {
            value: value,
            writable: false,
        });
    }
}