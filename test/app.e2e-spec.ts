import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/users/users.entity';
import { getConnection } from 'typeorm';
import { JwtModule } from '@nestjs/jwt';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'test',
          password: 'test',
          database: 'test',
          synchronize: true,
          entities: [User],
        }),
        JwtModule.register({
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
    await getConnection().dropDatabase();
    await getConnection().close();
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
