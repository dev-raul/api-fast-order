import faker from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src';
import * as request from 'supertest';

describe('EmployeeController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/employees (POST)', async () => {
    const requestBody = {
      name: faker.name.firstName(),
      cpf: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app.getHttpServer())
      .post('/api/employees')
      .send(requestBody);

    expect(response.status).toEqual(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
    expect(response.body?.employee?.cpf).toEqual(requestBody?.cpf);
  });
});
