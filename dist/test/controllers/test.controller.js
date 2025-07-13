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
exports.TestController = void 0;
const controller_1 = require("../../decorators/controller");
const method_1 = require("../../decorators/method");
const http_method_1 = require("../../enums/http_method");
const injection_user_1 = require("../../decorators/injection_user");
const injections_1 = require("../../decorators/injections");
const test_service_1 = require("../services/test.service");
let TestController = class TestController {
    testService;
    async test() {
        await this.testService.addNewVisity();
        return {
            "status": "success",
            "message": "Testado!",
        };
    }
};
exports.TestController = TestController;
__decorate([
    (0, injections_1.Inject)(),
    __metadata("design:type", test_service_1.TestService)
], TestController.prototype, "testService", void 0);
__decorate([
    (0, method_1.Method)(http_method_1.HttpMethod.GET),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "test", null);
exports.TestController = TestController = __decorate([
    (0, controller_1.Controller)(),
    (0, injection_user_1.InjectionUser)()
], TestController);
