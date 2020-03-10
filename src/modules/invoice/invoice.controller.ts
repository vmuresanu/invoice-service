import { Body, Controller, Get, Param, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceResponse } from './entity/invoice.response';
import { ValidationPipe } from '../../infrastucture/validation.pipe';
import { InvoiceRequest } from './entity/invoice.request';
import { LoggedInGuard } from '../../infrastucture/logged-in.guard';

@Controller('invoices')
@UseGuards(LoggedInGuard)
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
    const x = await this.invoiceService.create(invoiceRequest);
    console.log(invoiceRequest)
    console.log(x)
    return x;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateBook(@Param('id') id: string, @Body() bookDTO: Partial<InvoiceRequest>) {
    return this.invoiceService.update(id, bookDTO);
  }
}
