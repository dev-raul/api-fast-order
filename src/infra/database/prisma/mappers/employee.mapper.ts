import { Prisma, Employee as RawEmployee } from '@prisma/client';

import { Employee } from '@domain/entities/employee.entity';

export class EmployeeMapper {
  static toDomain(raw: RawEmployee): Employee {
    const employee = Employee.create(
      {
        name: raw.name,
        cpf: raw.cpf,
        password: raw.password,
        createdAt: raw.created_at,
        deleted: false,
      },
      raw.id,
    );

    return employee;
  }

  static toPrisma(employee: Employee): Prisma.EmployeeCreateInput {
    return {
      name: employee.name,
      cpf: employee.cpf,
      password: employee.password,
      created_at: employee.createdAt,
    };
  }
}
