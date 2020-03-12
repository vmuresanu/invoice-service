import { Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ValidationPipe } from '../../infrastucture/validation.pipe';
import { InvoiceRequest } from './entity/invoice.request';
import { AuthGuard } from '@nestjs/passport';

@Controller('invoices')
@UseGuards(AuthGuard('jwt'))
export class InvoiceController {

  constructor(private invoiceService: InvoiceService) {
  }

  @Get()
  async getBooks() {
    return this.invoiceService.getAll();
  }

  @Get(':id')
  async getBook(@Param('id') id: string) {
    return this.invoiceService.getById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createInvoice(@Body() invoiceRequest: InvoiceRequest) {
    return await this.invoiceService.create(invoiceRequest);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateInvoice(@Param('id') id: string, @Body() invoiceRequest: Partial<InvoiceRequest>) {
    return this.invoiceService.update(id, invoiceRequest);
  }
}
