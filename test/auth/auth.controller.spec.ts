import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { LoginDto, RegisterDto } from '../../src/auth/dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ access_token: 'jwtToken' }),
    register: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com', username: 'testuser' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
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
