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
  static toHttp(user: Employee): EmployeeViewModelResponse {
    return {
      id: user?.id,
      name: user.name,
      cpf: user.cpf,
      createdAt: user.createdAt,
    };
  }
}
