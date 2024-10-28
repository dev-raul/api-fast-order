import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

import { UseCaseCreateSignIn } from '@domain/use-cases/auth/create-signin';
import { UseCaseRefreshToken } from '@domain/use-cases/auth/refresh-token';
import { UseCaseGetEmployeeById } from '@domain/use-cases/employee/get-employee-by-id';

import { RequestAuthUser } from '@infra/http/auth/auth-user';
import { Public } from '@infra/http/auth/public';
import {
  EmployeeViewModel,
  EmployeeViewModelResponse,
} from '@infra/http/view-models/employee-view-model';

import { CreateSignInBody } from './dto/create-signin-body';
import { CreateSignInResponse } from './dto/create-signin-response';
import { RefreshTokenBody } from './dto/refresh-token-body';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private useCaseCreateSignIn: UseCaseCreateSignIn,
    private useCaseRefreshToken: UseCaseRefreshToken,
    private useCaseGetEmployeeById: UseCaseGetEmployeeById,
  ) {}

  @ApiOperation({ summary: 'Create employee signin' })
  @ApiResponse({
    type: CreateSignInResponse,
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @Public()
  async signIn(@Body() body: CreateSignInBody): Promise<CreateSignInResponse> {
    const { accessToken, refreshToken } =
      await this.useCaseCreateSignIn.execute(body);

    return { accessToken, refreshToken };
  }

  @ApiOperation({ summary: 'Generate new valid token by refreshToken' })
  @ApiResponse({
    type: CreateSignInResponse,
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @Public()
  async refreshToken(
    @Body() body: RefreshTokenBody,
  ): Promise<CreateSignInResponse> {
    const { accessToken, refreshToken } =
      await this.useCaseRefreshToken.execute({
        refreshToken: body.refreshToken,
      });

    return { accessToken, refreshToken };
  }

  @ApiOperation({ summary: 'Get employee by current session' })
  @Get('profile')
  @ApiResponse({
    type: EmployeeViewModelResponse,
    status: HttpStatus.OK,
  })
  @ApiBearerAuth()
  async getProfile(
    @Request() req: RequestAuthUser,
  ): Promise<EmployeeViewModelResponse> {
    const employee = await this.useCaseGetEmployeeById.execute({
      id: req.user.sub,
    });

    return EmployeeViewModel.toHttp(employee);
  }
}
