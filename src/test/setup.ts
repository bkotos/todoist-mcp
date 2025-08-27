// Test setup file for Jest
import { config } from 'dotenv';

// Load environment variables for tests
config({ path: 'env.test' });

// Global test timeout
jest.setTimeout(10000);

// Mock console.error to reduce noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
