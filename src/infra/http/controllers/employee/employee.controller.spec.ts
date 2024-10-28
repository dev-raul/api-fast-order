import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { UseCaseCreateEmployee } from '@domain/use-cases/employee/create-employee';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';
import { EmployeeViewModel } from '@infra/http/view-models/employee-view-model';

import { makeFakeEmployee } from '@test/factories/employees.factory';
import { InMemoryEmloyeesRepository } from '@test/repositories/in-memory-employees.repository';

import { EmployeesController } from './employee.controller';

describe('EmployeeController', () => {
  let employeeController: EmployeesController;
  let useCaseCreateEmployee: UseCaseCreateEmployee;
  let employeeRepository: EmployeesRepository;
  let encryptorService: EncryptorService;

  const employee = makeFakeEmployee({}, 1);

  beforeEach(async () => {
    employeeRepository = new InMemoryEmloyeesRepository();
    encryptorService = new BcryptEncryptorService();
    useCaseCreateEmployee = new UseCaseCreateEmployee(
      employeeRepository,
      encryptorService,
    );
    employeeController = new EmployeesController(useCaseCreateEmployee);
  });

  it('should create employee', async () => {
    jest.spyOn(useCaseCreateEmployee, 'execute').mockResolvedValue(employee);

    expect(
      await employeeController.create({
        name: employee.name,
        cpf: employee.cpf,
        password: employee.password,
      }),
    ).toEqual({
      employee: EmployeeViewModel.toHttp(employee),
    });
  });
});
