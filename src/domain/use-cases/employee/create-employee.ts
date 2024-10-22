import { Injectable } from '@nestjs/common';

import { Employee } from '@domain/entities/employee.entity';
import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { AlreadyExistError } from '@domain/value-objects/errors/already-exist-error';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';

type UseCaseCreateEmployeeRequest = Pick<Employee, 'cpf' | 'name' | 'password'>;

type UseCaseCreateEmployeeResponse = Employee;

@Injectable()
export class UseCaseCreateEmployee {
  constructor(
    private employeesRepository: EmployeesRepository,
    private encryptorService: EncryptorService,
  ) {}
  async execute({
    name,
    cpf,
    password: _password,
  }: UseCaseCreateEmployeeRequest): Promise<UseCaseCreateEmployeeResponse> {
    const findEmployee = await this.employeesRepository.findByCpf(cpf);
    if (findEmployee) throw new AlreadyExistError('cpf', cpf);

    const password = await this.encryptorService.hash(_password);

    const employee = Employee.create({
      name,
      cpf,
      password,
      deleted: false,
    });

    const createdEmployee = await this.employeesRepository.create(employee);

    return createdEmployee;
  }
}
