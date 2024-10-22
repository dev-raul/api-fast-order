import faker from '@faker-js/faker';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { AlreadyExistError } from '@domain/value-objects/errors/already-exist-error';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';

import { makeFakeEmployee } from '@test/factories/employees.factory';
import { InMemoryEmloyeesRepository } from '@test/repositories/in-memory-employees.repository';

import { UseCaseCreateEmployee } from './create-employee';

jest.useFakeTimers({
  now: new Date('2023-02-25T16:33:55.016Z'),
});

describe('UseCaseCreateEmployee', () => {
  let useCaseCreateEmployee: UseCaseCreateEmployee;
  let employeeRepository: EmployeesRepository;
  let encryptorService: EncryptorService;

  const employee = makeFakeEmployee(
    {
      password: 'HASH_PASSWORD',
    },
    1,
  );

  beforeEach(async () => {
    encryptorService = new BcryptEncryptorService();
    employeeRepository = new InMemoryEmloyeesRepository();
    useCaseCreateEmployee = new UseCaseCreateEmployee(
      employeeRepository,
      encryptorService,
    );
  });

  // it('should error to email bad formated', async () => {
  //   await expect(
  //     useCaseCreateEmployee.execute({
  //       email: 'invalid-email',
  //       password: user.password,
  //     }),
  //   ).rejects.toThrow(EmailBadFormattedError);
  // });

  it('should error to already exist employee', async () => {
    await employeeRepository.create(employee);
    await expect(
      useCaseCreateEmployee.execute({
        name: employee.name,
        cpf: employee.cpf,
        password: employee.password,
      }),
    ).rejects.toThrow(AlreadyExistError);
  });

  it('should create employee', async () => {
    jest.spyOn(encryptorService, 'hash').mockResolvedValue(employee.password);

    expect(
      await useCaseCreateEmployee.execute({
        name: employee.name,
        cpf: employee.cpf,
        password: faker.internet.password(),
      }),
    ).toEqual(employee);
  });
});
