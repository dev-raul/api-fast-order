import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyExistError extends HttpException {
  constructor(property: string, email: string) {
    super(`The ${property} '${email}' already exist.`, HttpStatus.BAD_REQUEST);
  }
}
