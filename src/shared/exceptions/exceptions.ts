import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidSortingParameterException extends HttpException {
  constructor() {
    super('Invalid sort parameter. Should accept only + or -', HttpStatus.BAD_REQUEST);
  }
}
