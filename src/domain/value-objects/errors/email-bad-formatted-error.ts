import { HttpException, HttpStatus } from '@nestjs/common';

export class BadFormattedError extends HttpException {
  constructor(label: string, value: string) {
    super(`The ${label} '${value}' is bad formatted.`, HttpStatus.BAD_REQUEST);
  }
}
