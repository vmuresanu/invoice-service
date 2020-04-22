export function createInvoiceControllerMock() {
}

export function createInvoiceServiceMock() {
}

export const createInvoiceRepositoryMock = {
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
  findByIds: jest.fn(),
};

export const createInvoiceStatusRepositoryMock = {
  findOne: jest.fn(),
};

