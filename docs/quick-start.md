# 🚀 Começo Rápido

Vamos criar uma aplicação Flowpress simples com um endpoint de exemplo.

### Passo 1: Importe reflect-metadata

É essencial que import "reflect-metadata"; seja a primeira linha do seu arquivo de entrada principal (ex: src/index.ts ou src/main.ts), antes de quaisquer outras importações ou códigos.

```ts
// src/main.ts (ou outro arquivo de entrada)
import "reflect-metadata"; // <-- Esta deve ser a PRIMEIRA linha
// ... o resto do código segue abaixo
```

### Passo 2: Declare sua Classe Principal da Aplicação

Crie uma classe que servirá como base para sua aplicação, decorando-a com @AppDeclaration. Esta classe conterá as configurações essenciais.

```ts
// src/app.ts
import { AppDeclaration } from "flowpress";

@AppDeclaration<App>({
    port: (app) => app.port, // Define a porta da aplicação
    // controllers: [], // Adicionaremos os controllers aqui depois
})
export class App {
    readonly port: number = 3000; // Porta padrão
}
```
### Passo 3: Crie um Controlador (Controller)

Defina uma classe para seu controlador, decorando-a com @Controller. Os métodos dentro dela serão os endpoints da sua API.

```ts
// src/controllers/app.controller.ts
import { Controller, HttpMethod, Method } from "flowpress";

@Controller() // Define que esta classe é um controlador
export class AppController {
    @Method(HttpMethod.GET) // Mapeia o método GET para a rota base do controlador
    async get() {
        return {
            message: "Sucesso! Aplicativo rodando com Flowpress.",
        }
    }
}
```

Por padrão, um @Controller() sem parâmetros mapeia-se para a rota /.

### Passo 4: Conecte o Controlador à Aplicação

Agora, adicione o AppController à sua AppDeclaration para que o Flowpress possa registrá-lo.

```ts
// src/app.ts
import { AppDeclaration } from "flowpress";
import { AppController } from "./controllers/app.controller"; // Importe seu controlador

@AppDeclaration<App>({
    port: (app) => app.port,
    controllers: [
        AppController, // <-- Adicione seu controlador aqui
    ],
})
export class App {
    readonly port: number = 3000;
}
```
### Passo 5: Inicie a Aplicação

Crie uma função assíncrona para iniciar o servidor utilizando o AppService.start().

```ts
// src/main.ts
import "reflect-metadata"; // PRIMEIRA LINHA
import { AppDeclaration, AppService, Controller, HttpMethod, Method } from "flowpress";
import { App } from "./app"; // Importe a classe App
import { AppController } from "./controllers/app.controller"; // Importe a classe AppController

// Colocamos o AppController e App aqui para o exemplo completo,
// mas em um projeto real eles estariam em seus próprios arquivos, como demonstrado acima.

// Exemplo completo:
@Controller()
export class HomeController {
    @Method(HttpMethod.GET)
    async get() {
        return {
            message: "Sucesso! Aplicativo rodando com Flowpress.",
        }
    }
}

@AppDeclaration<App>({
    port: (app) => app.port,
    controllers: [
        HomeController, // Usando HomeController para evitar conflito de nome no exemplo completo
    ],
})
export class MyApplication { // Renomeado para MyApplication para o exemplo completo
    readonly port: number = 3000;
}

async function bootstrap() {
    const app = new MyApplication(); // Crie uma instância da sua aplicação
    const server = await AppService.start(app); // Inicie o servidor

    console.log(`🚀 Servidor Flowpress rodando na porta ${app.port}`);
    // Pronto! O servidor está ativo e escutando requisições.
}

bootstrap(); // Chame a função para iniciar
```

Após executar o bootstrap(), seu servidor estará rodando. Se acessar http://localhost:3000 em seu navegador ou via ferramenta de API (como Postman/Insomnia), você deverá ver a mensagem de sucesso!