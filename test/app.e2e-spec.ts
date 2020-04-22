import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { InvoiceModule } from '../src/modules/invoice/invoice.module';
import { InvoiceRepository } from '../src/modules/invoice/invoice.repository';
import { createInvoiceRepositoryMock } from '../src/modules/invoice/mocks/invoice-components.mock';
import { ScheduleRepository } from '../src/modules/schedule/schedule.repository';
import { InvoiceStatusRepository } from '../src/modules/invoice-status/invoice-status.repository';
import { AuthGuard } from '@nestjs/passport';
import { getInvoicesExpectedMock } from '../src/modules/invoice/mocks/invoice-response.mock';

describe('InvoiceController (e2e)', () => {
  let app;
  let invoiceRepository = createInvoiceRepositoryMock;
  let invoiceStatusRepository = {};
  let scheduleRepository = {};

  beforeAll(async () => {
    const moduleRef : TestingModule = await Test.createTestingModule({
      imports: [InvoiceModule],
    })
      .overrideProvider(InvoiceRepository)
      .useValue(invoiceRepository)
      .overrideProvider(ScheduleRepository)
      .useValue(scheduleRepository)
      .overrideProvider(InvoiceStatusRepository)
      .useValue(invoiceStatusRepository)
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/invoices?page=1&limit=10')
      .expect(200)
      .expect(getInvoicesExpectedMock);
  });
});
