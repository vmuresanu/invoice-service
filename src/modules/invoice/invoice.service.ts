import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { Invoice } from './entity/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceResponse } from './entity/invoice.response';
import { InvoiceRequest } from './entity/invoice.request';
import { plainToClass } from 'class-transformer';
import { CodeEnum } from '../../shared/model/code.enum';
import { InvoiceStatus } from '../invoice-status/entity/invoice-status.entity';
import { Paginator } from '../../infrastucture/pagination/paginator.interface';
import { constructPagination } from '../../infrastucture/pagination/pagination-function';
import { PaginationOptions } from '../../infrastucture/pagination/pagination-options.interface';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceStatus)
    private readonly invoiceStatusRepository: Repository<InvoiceStatus>) {
  }

  async getInvoices(options: PaginationOptions): Promise<Paginator<InvoiceResponse[]>> {
    return this.invoiceRepository
      .findAndCount({
        take: options.limit,
        skip: options.limit * (options.page - 1),
        relations: ['status'],
      })
      .then(([invoices, totalItems]) => {
        options.total = totalItems;
        return constructPagination<InvoiceResponse>(plainToClass(InvoiceResponse, invoices), options);
      });
  }

  async getInvoice(id: string): Promise<InvoiceResponse> {
    return await this.invoiceRepository
      .findOne({ where: { uuid: id }, relations: ['status'] })
      .then((invoice: Invoice) => {
        if (!invoice) {
          throw new HttpException('Invoice with given id Not found', HttpStatus.NOT_FOUND);
        }
        return plainToClass(InvoiceResponse, invoice)
      })
  }

  async create(invoiceRequest: InvoiceRequest): Promise<InvoiceResponse> {
    const st = await this.invoiceStatusRepository.findOne({ where: { code: CodeEnum.NEW } });
    const invoice = this.invoiceRepository.create(invoiceRequest);
    invoice.status = st;
    return this.invoiceRepository
      .save(invoice)
      .then((invoice: Invoice) => {
        return plainToClass(InvoiceResponse, invoice)
      });
  }

  async update(id: string, invoiceRequest: Partial<InvoiceRequest>): Promise<InvoiceResponse> {
    const invoice = await this.invoiceRepository
    .findOne({
      where: { uuid: id },
      relations: ['status'] 
    });
    if (!invoice) {
      throw new HttpException('Invoice with such id doesn\'t exist', HttpStatus.NOT_FOUND);
    }
    return this.invoiceRepository
      .save({ ...invoice, ...invoiceRequest })
      .then((invoice: Invoice) => {
        return plainToClass(InvoiceResponse, invoice)
      }) ;
  }

  async delete(id: string): Promise<void> {
    const invoice = await this.invoiceRepository.findOne({ where: { uuid: id } });
    if (!invoice) {
      throw new HttpException('Invoice with such id doesn\'t exist', HttpStatus.NOT_FOUND);
    }
    this.invoiceRepository.delete({ uuid: id });
  }
}
