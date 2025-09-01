// Test setup file for Vitest
import { config } from 'dotenv';
import { vi, beforeAll, afterAll } from 'vitest';

// Load environment variables for tests
config({ path: 'env.test' });

// Global test timeout
vi.setConfig({ testTimeout: 10000 });

// Mock console.error to reduce noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Suppress our tool handler console.error messages during tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Executing') ||
        args[0].includes('completed successfully') ||
        args[0].includes('Creating transport') ||
        args[0].includes('Connecting server') ||
        args[0].includes('Todoist MCP server started') ||
        args[0].includes('Server ready to handle requests'))
    ) {
      return;
    }

    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
