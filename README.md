# Flowpress

![Flowpress Logo](https://img.shields.io/badge/Flowpress-v1.0.0-blue?style=for-the-badge&logo=typescript&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## 🚀 Sobre o Flowpress

O **Flowpress** é um miniframework para a criação de APIs REST, fortemente inspirado na simplicidade e na elegância do NestJS, mas com o objetivo de ser ainda mais **simples, limpo e leve**. Desenvolvido em **TypeScript**, ele oferece uma abordagem direta para construir aplicações robustas com foco em performance e facilidade de uso.

É a solução ideal para desenvolvedores que buscam um ambiente ágil para APIs, aproveitando a tipagem forte do TypeScript e a flexibilidade do Express, sem a complexidade de frameworks maiores.

## ✨ Principais Características

* **Leve e Minimalista:** Menos abstrações, mais controle direto.
* **Baseado em Decorators:** Sintaxe familiar e intuitiva para definição de rotas e estruturas.
* **Tipagem Forte com TypeScript:** Maior segurança e manutenibilidade do código.
* **Flexível:** Construído sobre o Express, permitindo o uso de todo o ecossistema de middlewares.
* **Foco em API REST:** Otimizado para a criação de serviços HTTP.

## 🛠️ Tecnologias Utilizadas

O Flowpress utiliza as seguintes tecnologias em sua base:

* **[Express.js](https://expressjs.com/):** O popular framework web para Node.js.
* **[Dotenv](https://github.com/motdotla/dotenv):** Carrega variáveis de ambiente de um arquivo `.env`.
* **[Reflect-metadata](https://github.com/rbuckton/reflect-metadata):** Uma API para metadados de decoradores, essencial para o funcionamento do framework.
* **[TypeScript](https://www.typescriptlang.org/):** Superconjunto tipado de JavaScript.

## 📦 Instalação

Siga os passos abaixo para configurar seu ambiente e começar a usar o Flowpress.

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/en/) (versão LTS recomendada) instalado em sua máquina.

### Configuração do Projeto

1.  **Crie e inicialize seu projeto:**
    ```bash
    mkdir meu-projeto-Flowpress
    cd meu-projeto-Flowpress
    npm init -y # ou `yarn init -y` / `pnpm init`
    ```

2.  **Instale o Flowpress e suas dependências:**
    É **altamente recomendado** utilizar `pnpm` para instalações mais eficientes.

    ```bash
    pnpm add Flowpress express reflect-metadata dotenv
    # Ou se preferir npm:
    # npm install Flowpress express reflect-metadata dotenv
    ```

3.  **Instale o TypeScript globalmente (se ainda não tiver):**
    ```bash
    pnpm add -g typescript
    # Ou se preferir npm:
    # npm install -g typescript
    ```

4.  **Inicialize o TypeScript no seu projeto:**
    No diretório raiz do seu projeto, execute:
    ```bash
    tsc --init
    ```
    Isso criará o arquivo `tsconfig.json`.

### Configuração do `tsconfig.json`

É **vital** que as seguintes configurações estejam presentes no seu arquivo `tsconfig.json` para que os decoradores funcionem corretamente:

```json
{
  "compilerOptions": {
    /* ... outras opções ... */
    "experimentalDecorators": true, // Habilita o uso de decoradores
    "emitDecoratorMetadata": true,  // Habilita a emissão de metadados para decoradores
    /* ... outras opções ... */
  }
}
```

## 📚 Documentação
> Aviso: a documentação ainda não está completa
- 👉 [Início rápido](./docs/quick-start.md)

## 📄 Licença
Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.