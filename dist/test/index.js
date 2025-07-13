"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const flowpress_1 = require("../models/flowpress");
const app_1 = require("./app");
async function main() {
    const app = new app_1.App();
    const flowpress = await flowpress_1.Flowpress.start(app);
    console.log(`Servidor rodando em http://localhost:${flowpress.port}`);
}
main();
