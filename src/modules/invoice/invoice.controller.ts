import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, UsePipes, Delete } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

import { InvoiceRequest } from './entity/invoice.request';
import { AuthGuard } from '@nestjs/passport';
import { InvoiceResponse } from './entity/invoice.response';
import { Paginator } from '../../infrastucture/pagination/paginator.interface';
import { ValidationPipe } from 'core-service-vm/dist/core-service-module/pipes/validation.pipe'

@Controller('invoices')
@UseGuards(AuthGuard('jwt'))
export class InvoiceController {

  constructor(private readonly invoiceService: InvoiceService) {
  }

  @Get()
  async getInvoices(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<Paginator<InvoiceResponse[]>> {
    return this.invoiceService.getInvoices({ page, limit });
  }

  @Get('find/:id')
  async getInvoice(@Param('id') id: string): Promise<InvoiceResponse> {
    return this.invoiceService.getInvoice(id);
  }

  @Get('orders')
  async getData(@Query('period') period: string): Promise<InvoiceResponse> {
    return this.invoiceService.getData(period);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createInvoice(@Body() invoiceRequest: InvoiceRequest) {
    return await this.invoiceService.create(invoiceRequest);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateInvoice(@Param('id') id: string, @Body() invoiceRequest: Partial<InvoiceRequest>) {
    return this.invoiceService.update(id, invoiceRequest);
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: string) {
    return this.invoiceService.delete(id);
  }

  @Delete()
  async deleteInvoices(@Body() ids: string[]) {
    return this.invoiceService.deleteInvoices(ids);
  }
}
