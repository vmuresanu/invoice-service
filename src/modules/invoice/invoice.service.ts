import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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
import { InvoiceRepository } from './invoice.repository';
import { difference, map } from 'lodash';
import { BulkDeleteResponse } from '../../shared/model/bulk-delete.response';
import { ClientProxy } from '@nestjs/microservices';
import { Schedule } from '../schedule/entity/schedule.entity';
import { ScheduleRepository } from '../schedule/schedule.repository';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: InvoiceRepository,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: ScheduleRepository,
    @InjectRepository(InvoiceStatus)
    private readonly invoiceStatusRepository: Repository<InvoiceStatus>,
    @Inject('ORDER_SERVICE') private orderService: ClientProxy) {
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
      .findOne({ where: { id }, relations: ['status'] })
      .then((invoice: Invoice) => {
        if (!invoice) {
          throw new HttpException('Invoice with given id Not found', HttpStatus.NOT_FOUND);
        }
        return plainToClass(InvoiceResponse, invoice);
      });
  }

  async getData(period: string): Promise<any> {
    const pattern = { cmd: 'getOrdersByPeriod' };
    // TODO: get orders by id
    const result = await this.orderService.send<any, string>(pattern, period);
    console.log(result);
    return result;
  }

  async create(invoiceRequest: InvoiceRequest): Promise<InvoiceResponse> {
    const st = await this.invoiceStatusRepository.findOne({ where: { code: CodeEnum.DRAFT } });
    const invoice = this.invoiceRepository.create(invoiceRequest);
    invoice.status = st;
    return this.invoiceRepository
      .save(invoice)
      .then((invoice: Invoice) => {
        return plainToClass(InvoiceResponse, invoice);
      });
  }

  async update(id: string, invoiceRequest: Partial<InvoiceRequest>): Promise<InvoiceResponse> {
    const invoice = await this.invoiceRepository
      .findOne({
        where: { id },
        relations: ['status'],
      });
    if (!invoice) {
      throw new HttpException('Invoice with such id doesn\'t exist', HttpStatus.NOT_FOUND);
    }
    return this.invoiceRepository
      .save({ ...invoice, ...invoiceRequest })
      .then((invoice: Invoice) => {
        return plainToClass(InvoiceResponse, invoice);
      });
  }

  async delete(id: string): Promise<void> {
    const invoice = await this.invoiceRepository.findOne({ where: { id } });
    if (!invoice) {
      throw new HttpException('Invoice with such id doesn\'t exist', HttpStatus.NOT_FOUND);
    }
    let schedules = await this.scheduleRepository.find({ where: { invoiceId: id } });
    schedules?.forEach(sch => {
      this.scheduleRepository.delete({ id: sch.id });
    });
    await this.invoiceRepository.delete({ id });
  }

  async deleteInvoices(ids: string[]): Promise<BulkDeleteResponse> {
    const invoices = await this.invoiceRepository.findByIds(ids);
    if (!invoices.length) {
      throw new HttpException('Invoices with such ids doesn\'t exist', HttpStatus.NOT_FOUND);
    }
    const deletedIds: string[] = map(invoices, 'id');
    const unprocessedIds = difference(ids, deletedIds);
    deletedIds.map(async (id) => {
      let schedules = await this.scheduleRepository.find({ where: { invoiceId: id } });
      schedules?.forEach(sch => {
        this.scheduleRepository.delete({ id: sch.id });
      });
      await this.invoiceRepository.delete({ id });
    });
    return { deletedIds, unprocessedIds };
  }

  async moveToNew(id): Promise<InvoiceResponse> {
    const invoice: Invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['status'],
    });
    if (!invoice) {
      throw new HttpException('Invoice with such id doesn\'t exist', HttpStatus.NOT_FOUND);
    }

    if (invoice.status.code !== CodeEnum.DRAFT) {
      throw new HttpException('Invoice is not is status Draft', HttpStatus.BAD_REQUEST);
    }

    invoice.status = await this.invoiceStatusRepository.findOne({ where: { code: CodeEnum.NEW } });
    return this.invoiceRepository
      .save(invoice)
      .then((invoice: Invoice) => {
        return plainToClass(InvoiceResponse, invoice);
      });
  }

}
