import { ApiProperty } from '@nestjs/swagger';

import { Employee } from '@domain/entities/employee.entity';

export class EmployeeViewModelResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty()
  createdAt: Date;
}

export class EmployeeViewModel {
  static toHttp(employee: Employee): EmployeeViewModelResponse {
    return {
      id: employee?.id,
      name: employee.name,
      cpf: employee.cpf,
      createdAt: employee.createdAt,
    };
  }
}
