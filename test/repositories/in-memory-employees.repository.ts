import { Employee as RawEmployee } from '@prisma/client';

import { AsyncMaybe } from '@core/logic/Maybe';

import { Employee } from '@domain/entities/employee.entity';

import { EmployeeMapper } from '@infra/database/prisma/mappers/employee.mapper';
import { EmployeesRepository } from '@infra/database/repositories/employee.repository';

export class InMemoryEmloyeesRepository implements EmployeesRepository {
  public items: Array<RawEmployee> = [];

  async create(employee: Employee): Promise<Employee> {
    const item: RawEmployee = {
      id: this.items.length + 1,
      name: employee.name,
      cpf: employee.cpf,
      password: employee.password,
      created_at: employee.createdAt,
      updated_at: employee.updateAt,
      deleted: false,
    };

    this.items.push(item);

    return EmployeeMapper.toDomain(item);
  }

  async findByCpf(cpf: string): AsyncMaybe<Employee> {
    const item = this.items.find((item) => item.cpf === cpf);

    if (!item) {
      return null;
    }

    return EmployeeMapper.toDomain(item);
  }

  async findById(id: number): AsyncMaybe<Employee> {
    const item = this.items.find((item) => item.id === id);

    if (!item) {
      return null;
    }

    return EmployeeMapper.toDomain(item);
  }
}
