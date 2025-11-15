// Database mocks for testing

export const mockPool = {
  query: jest.fn(),
  connect: jest.fn(),
  end: jest.fn(),
  on: jest.fn(),
};

export const mockQueryResult = (rows: any[] = []) => ({
  rows,
  rowCount: rows.length,
  command: 'SELECT',
  oid: 0,
  fields: [],
});

// Mock pg Pool
jest.mock('../../config/database', () => ({
  pool: mockPool,
  default: mockPool,
}));

