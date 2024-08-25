"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_controller_1 = require("../../src/auth/auth.controller");
const auth_service_1 = require("../../src/auth/auth.service");
describe('AuthController', () => {
    let controller;
    let service;
    const mockAuthService = {
        login: jest.fn().mockResolvedValue({ access_token: 'jwtToken' }),
        register: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', username: 'testuser' }),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [auth_controller_1.AuthController],
            providers: [
                { provide: auth_service_1.AuthService, useValue: mockAuthService },
            ],
        }).compile();
        controller = module.get(auth_controller_1.AuthController);
        service = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('login', () => {
        it('should return a JWT token if credentials are valid', async () => {
            const result = await controller.login({ email: 'test@example.com', password: 'password' });
            expect(result).toEqual({ access_token: 'jwtToken' });
            expect(service.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
        });
    });
    describe('register', () => {
        it('should register a new user and return the user', async () => {
            const result = await controller.register({ email: 'test@example.com', username: 'testuser', password: 'password' });
            expect(result).toEqual({ id: 1, email: 'test@example.com', username: 'testuser' });
            expect(service.register).toHaveBeenCalledWith({ email: 'test@example.com', username: 'testuser', password: 'password' });
        });
    });
});
