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
const request = __importStar(require("supertest"));
const app_module_1 = require("../src/app.module");
const typeorm_1 = require("@nestjs/typeorm");
const users_entity_1 = require("../src/users/users.entity");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
describe('AppController (e2e)', () => {
    let app;
    let authToken;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [
                app_module_1.AppModule,
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'test',
                    password: 'test',
                    database: 'test',
                    synchronize: true,
                    entities: [users_entity_1.User],
                }),
                jwt_1.JwtModule.register({
                    secret: 'test_secret',
                    signOptions: { expiresIn: '60m' },
                }),
            ],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        const registerResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send({
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
        });
        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password123',
        });
        authToken = loginResponse.body.access_token;
    });
    afterAll(async () => {
        await (0, typeorm_2.getConnection)().dropDatabase();
        await (0, typeorm_2.getConnection)().close();
    });
    it('/users (GET)', async () => {
        const response = await request(app.getHttpServer())
            .get('/users')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
    it('/users (POST)', async () => {
        const response = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            email: 'newuser@example.com',
            username: 'newuser',
            password: 'newpassword123',
        })
            .expect(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe('newuser@example.com');
    });
    it('/users/:id (GET)', async () => {
        const createResponse = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            email: 'fetchuser@example.com',
            username: 'fetchuser',
            password: 'fetchpassword123',
        });
        const userId = createResponse.body.id;
        const response = await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        expect(response.body).toHaveProperty('id', userId);
        expect(response.body.email).toBe('fetchuser@example.com');
    });
    it('/users/:id (PUT)', async () => {
        const createResponse = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            email: 'updateuser@example.com',
            username: 'updateuser',
            password: 'updatepassword123',
        });
        const userId = createResponse.body.id;
        const response = await request(app.getHttpServer())
            .put(`/users/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            email: 'updateduser@example.com',
            username: 'updateduser',
        })
            .expect(200);
        expect(response.body.email).toBe('updateduser@example.com');
        expect(response.body.username).toBe('updateduser');
    });
    it('/users/:id (DELETE)', async () => {
        const createResponse = await request(app.getHttpServer())
            .post('/users')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
            email: 'deleteuser@example.com',
            username: 'deleteuser',
            password: 'deletepassword123',
        });
        const userId = createResponse.body.id;
        await request(app.getHttpServer())
            .delete(`/users/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);
        await request(app.getHttpServer())
            .get(`/users/${userId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(404);
    });
});
