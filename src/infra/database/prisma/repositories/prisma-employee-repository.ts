import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/Maybe';

import { Employee } from '@domain/entities/employee.entity';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';

import { EmployeeMapper } from '../mappers/employee.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaEmployeesRepository implements EmployeesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(employee: Employee): AsyncMaybe<Employee> {
    const employeeCreated = await this.prisma.employee.create({
      data: EmployeeMapper.toPrisma(employee),
    });

    return EmployeeMapper.toDomain(employeeCreated);
  }

  async findByCpf(cpf: string): AsyncMaybe<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        cpf,
        deleted: false,
      },
    });

    if (!employee) {
      return null;
    }

    return EmployeeMapper.toDomain(employee);
  }

  async findById(id: number): AsyncMaybe<Employee> {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id,
      },
    });

    if (!employee) {
      return null;
    }

    return EmployeeMapper.toDomain(employee);
  }
}
