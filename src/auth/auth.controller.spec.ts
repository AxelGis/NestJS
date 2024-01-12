import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app/app.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { User } from '../entities/user.entity';

describe('AuthController', () => {
  let app: INestApplication;
  let usersService: UsersService;
  const defaultUser = {
    username: 'test',
    email: 'test@test.com',
    password: '123456',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule, UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
    usersService = app.get<UsersService>(UsersService);
  });

  it('should register new user', async () => {
    jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1 } as User);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(defaultUser)
      .expect(200);
  });

  it('should return 400 with wrong username', async () => {
    jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1 } as User);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...defaultUser,
        username: 'a',
      })
      .expect(400);
  });

  it('should return 400 with wrong password', async () => {
    jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1 } as User);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...defaultUser,
        password: '123',
      })
      .expect(400);
  });

  it('should return 400 with wrong email', async () => {
    jest.spyOn(usersService, 'create').mockResolvedValue({ id: 1 } as User);

    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...defaultUser,
        email: 'not-valid',
      })
      .expect(400);
  });
});
