import { JwtService } from '@nestjs/jwt';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import { UseCaseRefreshToken } from '@domain/use-cases/auth/refresh-token';
import { UseCaseGetEmployeeById } from '@domain/use-cases/employee/get-employee-by-id';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';
import { BcryptEncryptorService } from '@infra/http/services/encryptor/bcrypt-encriptor-service';
import { EmployeeViewModel } from '@infra/http/view-models/employee-view-model';

import { makeFakeEmployee } from '@test/factories/employees.factory';
import { InMemoryEmloyeesRepository } from '@test/repositories/in-memory-employees.repository';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let useCaseCreateSignIn: UseCaseCreateSignIn;
  let useCaseGetEmployeeById: UseCaseGetEmployeeById;
  let useCaseRefreshToken: UseCaseRefreshToken;

  let employeeRepository: EmployeesRepository;

  let jwtService: JwtService;
  let encryptorService: EncryptorService;

  let authController: AuthController;

  const employee = makeFakeEmployee({}, 1);

  beforeEach(async () => {
    employeeRepository = new InMemoryEmloyeesRepository();
    encryptorService = new BcryptEncryptorService();
    useCaseCreateSignIn = new UseCaseCreateSignIn(
      employeeRepository,
      encryptorService,
      jwtService,
    );
    useCaseRefreshToken = new UseCaseRefreshToken(
      employeeRepository,
      jwtService,
    );
    useCaseGetEmployeeById = new UseCaseGetEmployeeById(employeeRepository);
    authController = new AuthController(
      useCaseCreateSignIn,
      useCaseRefreshToken,
      useCaseGetEmployeeById,
    );
  });

  it('should create signin', async () => {
    const tokenData = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    jest.spyOn(useCaseCreateSignIn, 'execute').mockResolvedValue(tokenData);

    expect(
      await authController.signIn({
        cpf: employee.cpf,
        password: employee.password,
      }),
    ).toEqual(tokenData);
  });

  it('should refresh token', async () => {
    const tokenData = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    jest.spyOn(useCaseRefreshToken, 'execute').mockResolvedValue(tokenData);

    expect(
      await authController.refreshToken({
        refreshToken: tokenData?.refreshToken,
      }),
    ).toEqual(tokenData);
  });

  it('should get profile', async () => {
    jest.spyOn(useCaseGetEmployeeById, 'execute').mockResolvedValue(employee);

    expect(
      await authController.getProfile({
        user: {
          sub: employee?.id,
          exp: 0,
          iat: 0,
        },
      }),
    ).toEqual(EmployeeViewModel.toHttp(employee));
  });
});
