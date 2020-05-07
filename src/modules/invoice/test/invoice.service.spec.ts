import { InvoiceService } from '../invoice.service';
import { createInvoiceRepositoryMock, createInvoiceStatusRepositoryMock } from '../mocks/invoice-components.mock';
import { InvoiceNotFoundException } from '../exceptions/exceptions';
import { getInvoiceResponseMock, getInvoicesExpectedMock } from '../mocks/invoice-response.mock';
import { invoiceRequestMock } from '../mocks/invoice-request.mock';
import { createInvoiceMock, createInvoicesMock, createInvoiceStatusMock } from '../mocks/invoice-entity.mock';

describe('InvoiceService', () => {
  const invoiceRepository = createInvoiceRepositoryMock as any;
  const scheduleRepository = {
    find: () => ([{ id: '1', rate: 2 }]),
    delete: jest.fn(),
  } as any;
  const invoiceStatusRepository = createInvoiceStatusRepositoryMock as any;
  const orderService = {} as any;
  let service: InvoiceService;

  beforeEach(async () => {
    jest.resetAllMocks();
    service = new InvoiceService(invoiceRepository, scheduleRepository, invoiceStatusRepository, orderService);
  });

  test('should be getInvoices', async () => {
    // Arrange
    jest.spyOn(invoiceRepository, 'findAndCount').mockReturnValueOnce(Promise.resolve([createInvoicesMock, 12]));

    // Act
    const response = service.getInvoices({ page: 1, limit: 10 });

    // Assert
    await expect(response).resolves.toEqual(getInvoicesExpectedMock);
  });

  describe('getInvoice', () => {
    test('should be getInvoice', async () => {
      // Arrange
      jest.spyOn(invoiceRepository, 'findOne').mockReturnValueOnce(Promise.resolve(createInvoiceMock));

      // Act
      const response = service.getInvoice('someId');

      // Assert
      await expect(response).resolves.toEqual(getInvoiceResponseMock);
    });

    test('should throw error if invoice is not found', async () => {
      // Arrange
      jest.spyOn(invoiceRepository, 'findOne').mockReturnValueOnce(Promise.resolve(undefined));

      // Act
      const response = service.getInvoice('someId');

      // Assert
      await expect(response).rejects.toEqual(new InvoiceNotFoundException());
    });
  });

  test('should createInvoices', async () => {
    // Arrange
    jest.spyOn(invoiceStatusRepository, 'findOne').mockReturnValueOnce(Promise.resolve(createInvoiceStatusMock));
    jest.spyOn(invoiceRepository, 'create').mockReturnValueOnce({});
    jest.spyOn(invoiceRepository, 'save').mockReturnValueOnce(Promise.resolve(createInvoiceMock));

    // Act
    const response = service.create(invoiceRequestMock);

    // Assert
    await expect(response).resolves.toEqual(getInvoiceResponseMock);
    expect(invoiceRepository.create).toHaveBeenCalled();
  });

  describe('updateInvoice', () => {
    test('should update', async () => {
      // Arrange
      jest.spyOn(invoiceRepository, 'findOne').mockReturnValueOnce(Promise.resolve(createInvoiceMock));
      jest.spyOn(invoiceRepository, 'save').mockReturnValueOnce(Promise.resolve(createInvoiceMock));

      // Act
      const response = service.update('someId', invoiceRequestMock);

      // Assert
      await expect(response).resolves.toEqual(getInvoiceResponseMock);
      expect(invoiceRepository.save).toHaveBeenCalled();
    });

    test('should throw error if invoice is not found', async () => {
      // Arrange
      jest.spyOn(invoiceRepository, 'findOne').mockReturnValueOnce(Promise.resolve(undefined));

      // Act
      const response = service.update('someId', {});

      // Assert
      await expect(response).rejects.toEqual(new InvoiceNotFoundException());
    });
  });

  describe('deleteInvoice', () => {
    test('should delete', async () => {
      // Arrange
      jest.spyOn(invoiceRepository, 'findOne').mockReturnValueOnce(Promise.resolve(createInvoiceMock));

      // Act
      await service.delete('someId');

      // Assert
      expect(scheduleRepository.delete).toHaveBeenCalled();
      expect(invoiceRepository.delete).toHaveBeenCalled();
    });

    test('should throw error if invoice is not found', async () => {
      // Arrange
      jest.spyOn(invoiceRepository, 'findOne').mockReturnValueOnce(Promise.resolve(undefined));

      // Act
      const response = service.delete('someId');

      // Assert
      await expect(response).rejects.toEqual(new InvoiceNotFoundException());
    });
  });

  describe('deleteInvoices', () => {
    test('should deleteInvoices', async () => {
      // Arrange
      jest.spyOn(invoiceRepository, 'findByIds').mockReturnValueOnce([
        { id: '1' }, { id: '2' },
      ]);

      // Act
      const result = await service.deleteInvoices(['1', '2']);

      // Assert
      expect(scheduleRepository.delete).toHaveBeenCalledTimes(2);
      expect(invoiceRepository.delete).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ deletedIds: ['1', '2'], unprocessedIds: [] });
    });

    /* test('should throw error if invoice is not found', async () => {
      // Arrange
      jest.spyOn(invoiceRepository, 'findOne').mockReturnValueOnce(Promise.resolve(undefined));

      // Act
      const response = service.delete('someId');

      // Assert
      await expect(response).rejects.toEqual(new InvoiceNotFoundException());
    });*/
  });
});
