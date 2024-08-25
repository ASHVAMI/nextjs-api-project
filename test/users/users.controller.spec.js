"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_controller_1 = require("../../src/users/users.controller");
const users_service_1 = require("../../src/users/users.service");
const common_1 = require("@nestjs/common");
describe('UsersController', () => {
    let controller;
    let service;
    const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
    };
    const mockUsersService = {
        create: jest.fn().mockResolvedValue(mockUser),
        findAll: jest.fn().mockResolvedValue([mockUser]),
        findOne: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn().mockResolvedValue(mockUser),
        remove: jest.fn().mockResolvedValue(undefined),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [users_controller_1.UsersController],
            providers: [
                { provide: users_service_1.UsersService, useValue: mockUsersService },
            ],
        }).compile();
        controller = module.get(users_controller_1.UsersController);
        service = module.get(users_service_1.UsersService);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedpassword',
            };
            expect(await controller.create(createUserDto)).toEqual(mockUser);
        });
    });
    describe('findAll', () => {
        it('should return an array of users', async () => {
            expect(await controller.findAll()).toEqual([mockUser]);
        });
    });
    describe('findOne', () => {
        it('should return a user by id', async () => {
            expect(await controller.findOne(1)).toEqual(mockUser);
        });
        it('should throw an error if user is not found', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new common_1.NotFoundException());
            await expect(controller.findOne(1)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto = { username: 'updateduser' };
            expect(await controller.update(1, updateUserDto)).toEqual(mockUser);
        });
        it('should throw an error if user is not found', async () => {
            jest.spyOn(service, 'update').mockRejectedValue(new common_1.NotFoundException());
            await expect(controller.update(1, {})).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('remove', () => {
        it('should remove a user', async () => {
            await controller.remove(1);
            expect(service.remove).toHaveBeenCalledWith(1);
        });
        it('should throw an error if user is not found', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new common_1.NotFoundException());
            await expect(controller.remove(1)).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
