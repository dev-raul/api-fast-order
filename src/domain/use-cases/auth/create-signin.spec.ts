import faker from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { InvalidCredentialError } from '@domain/value-objects/errors/invalid-credential-error';
import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';

import { makeFakeEmployee } from '@test/factories/employees.factory';
import { InMemoryEmloyeesRepository } from '@test/repositories/in-memory-employees.repository';

import { UseCaseCreateSignIn } from './create-signin';

describe('UseCaseCreateSignIn', () => {
  let useCaseCreateSignIn: UseCaseCreateSignIn;
  let employeeRepository: EmployeesRepository;
  let encryptorService: EncryptorService;
  let jwtService: JwtService;

  const employee = makeFakeEmployee({}, 1);
  const dataToken = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  };

  beforeEach(async () => {
    encryptorService = new BcryptEncryptorService();
    employeeRepository = new InMemoryEmloyeesRepository();
    jwtService = new JwtService();
    useCaseCreateSignIn = new UseCaseCreateSignIn(
      employeeRepository,
      encryptorService,
      jwtService,
    );
  });

  // it('should error to email bad formated', async () => {
  //   await expect(
  //     useCaseCreateSignIn.execute({
  //       cpf: 'invalid-email',
  //       password: user.password,
  //     }),
  //   ).rejects.toThrow(EmailBadFormattedError);
  // });

  it('should error to not exist employee', async () => {
    jest.spyOn(employeeRepository, 'findByCpf').mockResolvedValue(null);
    await expect(
      useCaseCreateSignIn.execute({
        cpf: employee.cpf,
        password: employee.password,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should error to invalid credential', async () => {
    jest.spyOn(employeeRepository, 'findByCpf').mockResolvedValue(employee);
    jest.spyOn(encryptorService, 'compare').mockResolvedValue(false);

    await expect(
      useCaseCreateSignIn.execute({
        cpf: employee.cpf,
        password: faker.internet.password(),
      }),
    ).rejects.toThrow(InvalidCredentialError);
  });

  it('should create signin', async () => {
    jest.spyOn(employeeRepository, 'findByCpf').mockResolvedValue(employee);
    jest.spyOn(encryptorService, 'compare').mockResolvedValue(true);
    jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValueOnce(dataToken.accessToken)
      .mockResolvedValue(dataToken.refreshToken);

    expect(
      await useCaseCreateSignIn.execute({
        cpf: employee.cpf,
        password: employee.password,
      }),
    ).toEqual(dataToken);
  });
});
