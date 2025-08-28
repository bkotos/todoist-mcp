import axios from 'axios';
import { createTodoistClient, getTodoistClient } from './client';

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variable
    delete process.env.TODOIST_API_TOKEN;
  });

  describe('createTodoistClient', () => {
    it('should create axios client with correct configuration', () => {
      // arrange
      const apiToken = 'test-token-123';
      const mockAxiosCreate = jest.fn().mockReturnValue({});
      mockAxios.create = mockAxiosCreate;

      // act
      createTodoistClient(apiToken);

      // assert
      expect(mockAxiosCreate).toHaveBeenCalledWith({
        baseURL: 'https://api.todoist.com/rest/v2',
        headers: {
          Authorization: 'Bearer test-token-123',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should return the created axios client', () => {
      // arrange
      const apiToken = 'test-token-123';
      const mockClient = { get: jest.fn() };
      mockAxios.create = jest.fn().mockReturnValue(mockClient);

      // act
      const result = createTodoistClient(apiToken);

      // assert
      expect(result).toBe(mockClient);
    });
  });

  describe('getTodoistClient', () => {
    it('should return client when TODOIST_API_TOKEN is set', () => {
      // arrange
      const apiToken = 'test-token-123';
      process.env.TODOIST_API_TOKEN = apiToken;
      const mockClient = { get: jest.fn() };
      mockAxios.create = jest.fn().mockReturnValue(mockClient);

      // act
      const result = getTodoistClient();

      // assert
      expect(result).toBe(mockClient);
      expect(mockAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.todoist.com/rest/v2',
        headers: {
          Authorization: 'Bearer test-token-123',
          'Content-Type': 'application/json',
        },
      });
    });

    it('should throw error when TODOIST_API_TOKEN is not set', () => {
      // arrange
      // process.env.TODOIST_API_TOKEN is already undefined from beforeEach

      // act
      const act = () => getTodoistClient();

      // assert
      expect(act).toThrow('TODOIST_API_TOKEN environment variable is required');
    });

    it('should throw error when TODOIST_API_TOKEN is empty string', () => {
      // arrange
      process.env.TODOIST_API_TOKEN = '';

      // act
      const act = () => getTodoistClient();

      // assert
      expect(act).toThrow('TODOIST_API_TOKEN environment variable is required');
    });

    it('should not throw error when TODOIST_API_TOKEN is whitespace only', () => {
      // arrange
      process.env.TODOIST_API_TOKEN = '   ';

      // act
      const result = getTodoistClient();

      // assert
      expect(result).toBeDefined();
    });
  });
});
