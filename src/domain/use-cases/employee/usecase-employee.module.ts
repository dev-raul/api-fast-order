import { Module } from '@nestjs/common';

import { DatabaseModule } from '@infra/database/database.module';
import { ServicesModule } from '@infra/http/services/services.module';

import { UseCaseCreateEmployee } from './create-employee';
import { UseCaseGetEmployeeById } from './get-employee-by-id';

@Module({
  imports: [DatabaseModule, ServicesModule],
  providers: [UseCaseGetEmployeeById, UseCaseCreateEmployee],
  exports: [UseCaseGetEmployeeById, UseCaseCreateEmployee],
})
export class UseCaseEmployeeModule {}
