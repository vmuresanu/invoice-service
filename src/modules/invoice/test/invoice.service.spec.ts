import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from '../invoice.service';

describe('InvoiceService', () => {
  let invoiceRepository = {} as any;
  let scheduleRepository = {} as any;
  let invoiceStatusRepository = {} as any;
  let orderService = {} as any;
  let service: InvoiceService;

  beforeEach(async () => {
    service = new InvoiceService(invoiceRepository, scheduleRepository, invoiceStatusRepository, orderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
