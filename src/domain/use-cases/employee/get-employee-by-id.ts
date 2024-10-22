import { Injectable } from '@nestjs/common';

import { Employee } from '@domain/entities/employee.entity';
import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';

type UseCaseGetEmployeeByIdRequest = {
  id: number;
};

type UseCaseGetEmployeeByIdResponse = Employee;

@Injectable()
export class UseCaseGetEmployeeById {
  constructor(private employeeRepository: EmployeesRepository) {}
  async execute({
    id,
  }: UseCaseGetEmployeeByIdRequest): Promise<UseCaseGetEmployeeByIdResponse> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) throw new NotFoundError('employee');

    return employee;
  }
}
