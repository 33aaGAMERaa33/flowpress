"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const app_config_1 = require("../decorators/app_config");
const env_getter_1 = require("../decorators/env_getter");
const test_controller_1 = require("./controllers/test.controller");
const database_1 = require("./database");
const test_service_1 = require("./services/test.service");
let App = class App {
    port;
    constructor() {
        (0, env_getter_1.envApplyProperties)(this);
    }
};
exports.App = App;
__decorate([
    (0, env_getter_1.EnvProperty)("PORT"),
    __metadata("design:type", Number)
], App.prototype, "port", void 0);
exports.App = App = __decorate([
    (0, app_config_1.AppConfig)({
        port: (app) => app.port,
        databaseConfig: database_1.AppDatabase,
        controllers: [
            test_controller_1.TestController,
        ],
        injectables: [
            test_service_1.TestService,
        ]
    }),
    __metadata("design:paramtypes", [])
], App);
