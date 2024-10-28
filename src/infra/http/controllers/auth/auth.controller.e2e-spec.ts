import { JWT_REFRESH_TOKEN_SECRECT } from '@config/jwt';
import faker from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src';
import * as request from 'supertest';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';

import { DatabaseModule } from '@infra/database/database.module';
import { EmployeeViewModel } from '@infra/http/view-models/employee-view-model';

import { EmployeeFactory } from '@test/factories/employees.factory';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let employeeFactory: EmployeeFactory;
  let encryptorService: EncryptorService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, AppModule],
      providers: [EmployeeFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    employeeFactory = moduleRef.get(EmployeeFactory);
    encryptorService = moduleRef.get(EncryptorService);
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  it('/auth/signin (POST)', async () => {
    const requestBody = {
      cpf: '802.033.830-60',
      password: faker.internet.password(),
    };

    await employeeFactory.makeEmployee({
      cpf: requestBody?.cpf,
      password: await encryptorService.hash(requestBody?.password),
    });

    const response = await request(app.getHttpServer())
      .post('/api/auth/signin')
      .send(requestBody);

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body?.accessToken).toBeTruthy();
    expect(response.body?.refreshToken).toBeTruthy();
  });

  it('/auth/refresh (POST)', async () => {
    const employee = await employeeFactory.makeEmployee({
      cpf: faker.internet.email(),
      password: await encryptorService.hash(faker.internet.password()),
    });

    const refreshToken = await jwtService.signAsync(
      {
        sub: employee.id,
      },
      {
        secret: JWT_REFRESH_TOKEN_SECRECT,
      },
    );

    const response = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('/auth/profile (GET)', async () => {
    const employee = await employeeFactory.makeEmployee({
      cpf: faker.internet.email(),
      password: await encryptorService.hash(faker.internet.password()),
    });
    const viewModelEmployee = EmployeeViewModel.toHttp(employee);

    const accessToken = await jwtService.signAsync({
      sub: employee.id,
    });

    const response = await request(app.getHttpServer())
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toEqual(HttpStatus.OK);
    expect(response.body).toBeDefined();
    expect(response.body).toMatchObject({
      ...viewModelEmployee,
      createdAt: expect.any(String),
    });
  });
});
