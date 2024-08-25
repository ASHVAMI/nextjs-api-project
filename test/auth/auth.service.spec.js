"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("../../src/auth/auth.service");
const users_service_1 = require("../../src/users/users.service");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
describe('AuthService', () => {
    let service;
    let usersService;
    let jwtService;
    const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
    };
    const mockUsersService = {
        findByEmail: jest.fn().mockResolvedValue(mockUser),
        create: jest.fn().mockResolvedValue(mockUser),
    };
    const mockJwtService = {
        sign: jest.fn().mockReturnValue('jwtToken'),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                { provide: users_service_1.UsersService, useValue: mockUsersService },
                { provide: jwt_1.JwtService, useValue: mockJwtService },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        usersService = module.get(users_service_1.UsersService);
        jwtService = module.get(jwt_1.JwtService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('login', () => {
        it('should return a JWT token if credentials are valid', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            const result = await service.login({ email: 'test@example.com', password: 'password' });
            expect(result).toEqual({ access_token: 'jwtToken' });
        });
        it('should throw UnauthorizedException if credentials are invalid', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            await expect(service.login({ email: 'test@example.com', password: 'wrongPassword' }))
                .rejects
                .toThrow(common_1.UnauthorizedException);
        });
    });
    describe('register', () => {
        it('should create a new user and return it', async () => {
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
            const result = await service.register({ email: 'test@example.com', username: 'testuser', password: 'password' });
            expect(result).toEqual(mockUser);
            expect(usersService.create).toHaveBeenCalledWith({
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedPassword',
            });
        });
    });
});
