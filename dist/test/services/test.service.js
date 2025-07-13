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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const typeorm_1 = require("typeorm");
const injectable_1 = require("../../decorators/injectable");
const injection_user_1 = require("../../decorators/injection_user");
const injections_1 = require("../../decorators/injections");
const visities_entity_1 = require("../entities/visities.entity");
let TestService = class TestService {
    visitiesRepository;
    async addNewVisity() {
        const newVisity = this.visitiesRepository.create();
        return await this.visitiesRepository.save(newVisity);
    }
};
exports.TestService = TestService;
__decorate([
    (0, injections_1.InjectRepository)(visities_entity_1.VisitiesEntity),
    __metadata("design:type", typeof (_a = typeof typeorm_1.Repository !== "undefined" && typeorm_1.Repository) === "function" ? _a : Object)
], TestService.prototype, "visitiesRepository", void 0);
exports.TestService = TestService = __decorate([
    (0, injectable_1.Injectable)(),
    (0, injection_user_1.InjectionUser)()
], TestService);
