import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { PrismaEmployeesRepository } from './prisma/repositories/prisma-employee-repository';
import { EmployeesRepository } from './repositories/employee.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: EmployeesRepository,
      useClass: PrismaEmployeesRepository,
    },
  ],
  exports: [PrismaService, EmployeesRepository],
})
export class DatabaseModule {}
