import { Injectable } from '@nestjs/common';

import { AsyncMaybe } from '@core/logic/Maybe';

import { Employee } from '@domain/entities/employee.entity';

@Injectable()
export abstract class EmployeesRepository {
  abstract create(employe: Employee): AsyncMaybe<Employee>;
  abstract findByCpf(email: string): AsyncMaybe<Employee>;
  abstract findById(id: number): AsyncMaybe<Employee>;
}
