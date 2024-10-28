import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';

import { makeFakeEmployee } from '@test/factories/employees.factory';
import { InMemoryEmloyeesRepository } from '@test/repositories/in-memory-employees.repository';

import { UseCaseGetEmployeeById } from './get-employee-by-id';

jest.useFakeTimers({
  now: new Date('2023-02-25T16:33:55.016Z'),
});

describe('UseCaseGetEmployeeById', () => {
  let useCaseGetEmployeeById: UseCaseGetEmployeeById;
  let employeeRepository: EmployeesRepository;

  const employee = makeFakeEmployee({}, 1);

  beforeEach(async () => {
    employeeRepository = new InMemoryEmloyeesRepository();
    useCaseGetEmployeeById = new UseCaseGetEmployeeById(employeeRepository);
  });

  it('should error to not exist employee', async () => {
    jest.spyOn(employeeRepository, 'findById').mockResolvedValue(null);
    await expect(
      useCaseGetEmployeeById.execute({
        id: employee.id,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should get employee', async () => {
    jest.spyOn(employeeRepository, 'findById').mockResolvedValue(employee);

    expect(
      await useCaseGetEmployeeById.execute({
        id: employee.id,
      }),
    ).toEqual(employee);
    expect(employeeRepository.findById).toHaveBeenCalledWith(employee.id);
  });
});
