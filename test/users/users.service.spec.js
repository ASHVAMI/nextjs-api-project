"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const users_service_1 = require("../../src/users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../../src/users/users.entity");
const common_1 = require("@nestjs/common");
describe('UsersService', () => {
    let service;
    let repository;
    const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedpassword',
    };
    const mockRepository = () => ({
        create: jest.fn().mockReturnValue(mockUser),
        save: jest.fn().mockResolvedValue(mockUser),
        find: jest.fn().mockResolvedValue([mockUser]),
        findOneBy: jest.fn().mockResolvedValue(mockUser),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
    });
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                users_service_1.UsersService,
                { provide: (0, typeorm_1.getRepositoryToken)(users_entity_1.User), useValue: mockRepository() },
            ],
        }).compile();
        service = module.get(users_service_1.UsersService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(users_entity_1.User));
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        it('should create a user', async () => {
            const createUserDto = {
                email: 'test@example.com',
                username: 'testuser',
                password: 'hashedpassword',
            };
            expect(await service.create(createUserDto)).toEqual(mockUser);
        });
    });
    describe('findAll', () => {
        it('should return an array of users', async () => {
            expect(await service.findAll()).toEqual([mockUser]);
        });
    });
    describe('findOne', () => {
        it('should return a user by id', async () => {
            expect(await service.findOne(1)).toEqual(mockUser);
        });
        it('should throw an error if user is not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('update', () => {
        it('should update a user', async () => {
            const updateUserDto = { username: 'updateduser' };
            const updatedUser = { ...mockUser, ...updateUserDto };
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockUser);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedUser);
            expect(await service.update(1, updateUserDto)).toEqual(updatedUser);
        });
        it('should throw an error if user is not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
            await expect(service.update(1, {})).rejects.toThrow(common_1.NotFoundException);
        });
    });
    describe('remove', () => {
        it('should remove a user', async () => {
            await service.remove(1);
            expect(repository.delete).toHaveBeenCalledWith(1);
        });
        it('should throw an error if user is not found', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 });
            await expect(service.remove(1)).rejects.toThrow(common_1.NotFoundException);
        });
    });
});
