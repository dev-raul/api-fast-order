import { Module } from '@nestjs/common';

import { UseCaseAuthModule } from './auth/usecase-auth.module';
import { UseCaseEmployeeModule } from './employee/usecase-employee.module';

@Module({
  imports: [UseCaseAuthModule, UseCaseEmployeeModule],
  exports: [UseCaseAuthModule, UseCaseEmployeeModule],
})
export class UseCaseModule {}
