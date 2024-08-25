import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../src/users/users.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
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
        .toThrow(UnauthorizedException);
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
