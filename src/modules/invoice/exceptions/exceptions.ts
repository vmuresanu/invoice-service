import { HttpException, HttpStatus } from '@nestjs/common';

export class InvoiceNotFoundException extends HttpException {
  constructor() {
    super('Invoice with such id doesn\'t exist', HttpStatus.NOT_FOUND);
  }
}

export class InvoiceStatusNotDraftException extends HttpException {
  constructor() {
    super('Invoice is not is status Draft', HttpStatus.BAD_REQUEST);
  }
}
