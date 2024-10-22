import { JWT_REFRESH_TOKEN_SECRECT } from '@config/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';

import { makeFakeEmployee } from '@test/factories/employees.factory';
import { InMemoryEmloyeesRepository } from '@test/repositories/in-memory-employees.repository';

import { UseCaseRefreshToken } from './refresh-token';

describe('UseCaseRefreshToken', () => {
  let useCaseRefreshToken: UseCaseRefreshToken;
  let employeeRepository: EmployeesRepository;
  let jwtService: JwtService;

  const employee = makeFakeEmployee({}, 1);
  const dataToken = {
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'REFRESH_TOKEN',
  };

  beforeEach(async () => {
    employeeRepository = new InMemoryEmloyeesRepository();
    jwtService = new JwtService();
    useCaseRefreshToken = new UseCaseRefreshToken(
      employeeRepository,
      jwtService,
    );
  });

  it('should error to invalid refresh token', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(null);
    await expect(
      useCaseRefreshToken.execute({
        refreshToken: 'CURRENT_REFRESH_TOKEN',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should error to not found employee', async () => {
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockResolvedValue({ sub: employee.id });
    jest.spyOn(employeeRepository, 'findById').mockResolvedValue(undefined);
    await expect(
      useCaseRefreshToken.execute({
        refreshToken: 'CURRENT_REFRESH_TOKEN',
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should refresh token', async () => {
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockResolvedValue({ sub: employee.id });
    jest.spyOn(employeeRepository, 'findById').mockResolvedValue(employee);
    jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValueOnce(dataToken.accessToken)
      .mockResolvedValue(dataToken.refreshToken);

    expect(
      await useCaseRefreshToken.execute({
        refreshToken: 'CURRENT_REFRESH_TOKEN',
      }),
    ).toEqual(dataToken);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith(
      'CURRENT_REFRESH_TOKEN',
      {
        secret: JWT_REFRESH_TOKEN_SECRECT,
      },
    );
    expect(employeeRepository.findById).toHaveBeenCalledWith(employee.id);
  });
});
