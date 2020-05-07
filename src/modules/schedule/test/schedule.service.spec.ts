import { ScheduleService } from '../schedule.service';
import { createScheduleRepositoryMock } from '../mocks/schedule-components.mock';
import { createInvoiceRepositoryMock } from '../../invoice/mocks/invoice-components.mock';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let scheduleRepository = createScheduleRepositoryMock as any;
  let invoiceRepository = createInvoiceRepositoryMock as any;

  beforeEach(async () => {
    // jest.resetAllMocks();
    service = new ScheduleService(scheduleRepository, invoiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
