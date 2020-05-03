import { createInvoiceRepositoryMock, createInvoiceStatusRepositoryMock } from '../mocks/invoice-components.mock';
import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceModule } from '../invoice.module';
import { InvoiceRepository } from '../invoice.repository';
import { InvoiceStatusRepository } from '../../invoice-status/invoice-status.repository';
import { ScheduleRepository } from '../../schedule/schedule.repository';
import { AuthGuard } from '@nestjs/passport';
import { getInvoiceResponseMock, getInvoicesExpectedMock } from '../mocks/invoice-response.mock';
import { createInvoicesMock } from '../mocks/invoice-entity.mock';
import * as request from 'supertest';
import { ValidationPipe } from 'core-service-vm/dist';

describe('InvoiceController (e2e)', () => {
  let app;
  let invoiceRepository = createInvoiceRepositoryMock;
  let invoiceStatusRepository = createInvoiceStatusRepositoryMock;
  let scheduleRepository = {};

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
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
      .overridePipe(ValidationPipe)
      .useValue({})
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/invoices (GET)', () => {
    jest.spyOn(invoiceRepository, 'findAndCount').mockReturnValueOnce(Promise.resolve([createInvoicesMock, 12]));
    return request(app.getHttpServer())
      .get('/invoices?page=1&limit=10&sort=+title')
      .expect(200)
      .expect(getInvoicesExpectedMock);
  });

  test('/invoices (POST)', () => {
    jest.spyOn(invoiceStatusRepository, 'findOne').mockReturnValueOnce(Promise.resolve({ id: 'x' }));
    jest.spyOn(invoiceRepository, 'create').mockReturnValueOnce(createInvoicesMock);
    jest.spyOn(invoiceRepository, 'save').mockReturnValueOnce(Promise.resolve(getInvoiceResponseMock));
    return request(app.getHttpServer())
      .post('/invoices')
      .send(createInvoicesMock)
      .expect(201)
  });
});
