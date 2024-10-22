import faker from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { Replace } from '@core/logic/Replace';

import { Employee, EmployeeProps } from '@domain/entities/employee.entity';

import { EmployeeMapper } from '@infra/database/prisma/mappers/employee.mapper';
import { PrismaService } from '@infra/database/prisma/prisma.service';

type Overrides = Partial<
  Replace<
    EmployeeProps,
    {
      cpf?: string;
      createdAt?: Date;
      updateAt?: Date;
    }
  >
>;

export function makeFakeEmployee(data = {} as Overrides, id?: number) {
  const name = faker.name.firstName();
  const cpf = faker.internet.email();
  const password = faker.internet.password();
  const createdAt = new Date();
  const updateAt = new Date();

  const props: EmployeeProps = {
    name: data.name || name,
    cpf: data.cpf || cpf,
    password: data.password || password,
    createdAt: data.createdAt || createdAt,
    updateAt: data.updateAt || updateAt,
    deleted: data.deleted || false,
  };

  const item = Employee.create(props, id);

  return item;
}

@Injectable()
export class EmployeeFactory {
  constructor(private prisma: PrismaService) {}

  async makeEmployee(data = {} as Overrides, id?: number): Promise<Employee> {
    const employee = makeFakeEmployee(data, id);

    const rawUser = await this.prisma.employee.create({
      data: EmployeeMapper.toPrisma(employee),
    });

    return EmployeeMapper.toDomain(rawUser);
  }
}
