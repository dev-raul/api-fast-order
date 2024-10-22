import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UseCaseCreateEmployee } from '@domain/use-cases/employee/create-employee';

import { Public } from '@infra/http/auth/public';
import { EmployeeViewModel } from '@infra/http/view-models/employee-view-model';

import { CreateEmployeeBody } from './dto/create-employee-body';
import { CreateEmployeeResponse } from './dto/create-employee-response';

@ApiTags('employees')
@Controller('/employees')
export class EmployeesController {
  constructor(private useCaseCreateEmployee: UseCaseCreateEmployee) {}

  @ApiOperation({ summary: 'Create employee' })
  @ApiResponse({ type: CreateEmployeeResponse, status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  @Post('/')
  @Public()
  async create(
    @Body() body: CreateEmployeeBody,
  ): Promise<CreateEmployeeResponse> {
    const employee = await this.useCaseCreateEmployee.execute({
      name: body.name,
      cpf: body.cpf,
      password: body.password,
    });
    return {
      employee: EmployeeViewModel.toHttp(employee),
    };
  }
}
