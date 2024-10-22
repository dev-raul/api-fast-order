import {
  JWT_REFRESH_TOKEN_EXPIREIN,
  JWT_REFRESH_TOKEN_SECRECT,
} from '@config/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';
import { AuthUser } from '@infra/http/auth/auth-user';

type UseCaseRefreshTokenRequest = {
  refreshToken: string;
};

type UseCaseRefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class UseCaseRefreshToken {
  constructor(
    private employeeRepository: EmployeesRepository,
    private jwtService: JwtService,
  ) {}
  async execute({
    refreshToken: currentRefreshToken,
  }: UseCaseRefreshTokenRequest): Promise<UseCaseRefreshTokenResponse> {
    const payload = await this.jwtService.verifyAsync<AuthUser>(
      currentRefreshToken,
      {
        secret: JWT_REFRESH_TOKEN_SECRECT,
      },
    );

    if (!payload) throw new UnauthorizedException();

    const employee = await this.employeeRepository.findById(payload?.sub);
    if (!employee) throw new NotFoundError('employee');

    const accessToken = await this.jwtService.signAsync({
      sub: employee.id,
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: employee.id,
      },
      {
        secret: JWT_REFRESH_TOKEN_SECRECT,
        expiresIn: JWT_REFRESH_TOKEN_EXPIREIN,
      },
    );

    return { accessToken, refreshToken };
  }
}
