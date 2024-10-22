import {
  JWT_REFRESH_TOKEN_EXPIREIN,
  JWT_REFRESH_TOKEN_SECRECT,
} from '@config/jwt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { EncryptorService } from '@domain/services/encryptor/encriptor.service';
import { InvalidCredentialError } from '@domain/value-objects/errors/invalid-credential-error';
import { NotFoundError } from '@domain/value-objects/errors/not-found-error';

import { EmployeesRepository } from '@infra/database/repositories/employee.repository';

type UseCaseCreateSignInRequest = {
  cpf: string;
  password: string;
};

type UseCaseCreateSignInResponse = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class UseCaseCreateSignIn {
  constructor(
    private employeeRepository: EmployeesRepository,
    private encryptorService: EncryptorService,
    private jwtService: JwtService,
  ) {}
  async execute({
    cpf,
    password,
  }: UseCaseCreateSignInRequest): Promise<UseCaseCreateSignInResponse> {
    const employee = await this.employeeRepository.findByCpf(cpf);

    if (!employee) throw new NotFoundError('employee');

    const isValidPassword = await this.encryptorService.compare(
      password,
      employee.password,
    );

    if (!isValidPassword) throw new InvalidCredentialError();

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
