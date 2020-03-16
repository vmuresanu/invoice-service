import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UsePipes, Delete } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { ValidationPipe } from '../../infrastucture/validation.pipe';
import { InvoiceRequest } from './entity/invoice.request';
import { AuthGuard } from '@nestjs/passport';
import { InvoiceResponse } from './entity/invoice.response';
import { Paginator } from '../../infrastucture/pagination/paginator.interface';

@Controller('invoices')
@UseGuards(AuthGuard('jwt'))
export class InvoiceController {

  constructor(private invoiceService: InvoiceService) {
  }

  @Get()
  async getInvoices(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<Paginator<InvoiceResponse[]>> {
    return this.invoiceService.getInvoices({ page, limit });
  }

  @Get(':id')
  async getInvoice(@Param('id') id: string): Promise<InvoiceResponse> {
    return this.invoiceService.getInvoice(id);
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

  @Delete(':id')
  async deleteInvoice(@Param('id') id: string) {
    return this.invoiceService.delete(id);
  }
}
