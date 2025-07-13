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
exports.AppDatabase = void 0;
const database_config_1 = require("../decorators/database_config");
const env_getter_1 = require("../decorators/env_getter");
const visities_entity_1 = require("./entities/visities.entity");
let AppDatabase = class AppDatabase {
    constructor() {
        (0, env_getter_1.envApplyProperties)(this);
    }
    type;
    host;
    port;
    username;
    password;
    database;
    synchronize;
    logging = false;
    entities = [
        visities_entity_1.VisitiesEntity
    ];
};
exports.AppDatabase = AppDatabase;
__decorate([
    (0, env_getter_1.EnvProperty)("DB_TYPE"),
    __metadata("design:type", String)
], AppDatabase.prototype, "type", void 0);
__decorate([
    (0, env_getter_1.EnvProperty)("DB_HOST"),
    __metadata("design:type", String)
], AppDatabase.prototype, "host", void 0);
__decorate([
    (0, env_getter_1.EnvProperty)("DB_PORT"),
    __metadata("design:type", Number)
], AppDatabase.prototype, "port", void 0);
__decorate([
    (0, env_getter_1.EnvProperty)("DB_USERNAME"),
    __metadata("design:type", String)
], AppDatabase.prototype, "username", void 0);
__decorate([
    (0, env_getter_1.EnvProperty)("DB_PASSWORD"),
    __metadata("design:type", String)
], AppDatabase.prototype, "password", void 0);
__decorate([
    (0, env_getter_1.EnvProperty)("DB_DATABASE"),
    __metadata("design:type", String)
], AppDatabase.prototype, "database", void 0);
__decorate([
    (0, env_getter_1.EnvProperty)("DB_SYNCHRONIZE"),
    __metadata("design:type", Boolean)
], AppDatabase.prototype, "synchronize", void 0);
exports.AppDatabase = AppDatabase = __decorate([
    database_config_1.DataSourceConfig,
    __metadata("design:paramtypes", [])
], AppDatabase);
