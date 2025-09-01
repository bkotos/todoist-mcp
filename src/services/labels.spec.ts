import type { MockedFunction, Mocked } from 'vitest';
import {
  getAllLabels,
  getProjectLabels,
  getContextLabels,
  createProjectLabel,
} from './labels';
import { getTodoistClient } from './client';
import fs from 'fs';
import path from 'path';

// Mock the client module
vi.mock('./client');
// Mock fs module
vi.mock('fs');
vi.mock('path');

const mockGetTodoistClient = getTodoistClient as MockedFunction<
  typeof getTodoistClient
>;
const mockFs = fs as Mocked<typeof fs>;
const mockPath = path as Mocked<typeof path>;

describe('Labels Functions', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    // Reset path mock
    mockPath.join.mockReturnValue('.cache/labels.json');
    mockPath.dirname.mockReturnValue('.cache');
  });

  describe('getAllLabels', () => {
    it('should return all labels when API call succeeds', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
        {
          id: '2',
          name: 'Personal',
          color: 'blue',
          order: 2,
          is_favorite: true,
        },
        {
          id: '3',
          name: 'Urgent',
          color: 'red',
          order: 3,
          is_favorite: false,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getAllLabels();

      // assert
      expect(result.labels).toHaveLength(3);
      expect(result.labels[0].id).toBe(1);
      expect(result.labels[0].name).toBe('Work');
      expect(result.labels[0].color).toBe('charcoal');
      expect(result.labels[1].name).toBe('Personal');
      expect(result.labels[1].is_favorite).toBe(true);
      expect(result.total_count).toBe(3);
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getAllLabels();

      // assert
      expect(result.labels).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = getAllLabels();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get all labels: API Error'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should return cached labels when cache is fresh', async () => {
      // arrange
      const cachedLabels = {
        labels: [
          {
            id: 1,
            name: 'Work',
            color: 'charcoal',
            order: 1,
            is_favorite: false,
          },
          {
            id: 2,
            name: 'Personal',
            color: 'blue',
            order: 2,
            is_favorite: true,
          },
        ],
        total_count: 2,
        cached_at: '2024-01-01T00:00:00Z',
      };
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(),
        isFile: () => true,
      } as any);
      mockFs.readFileSync.mockReturnValue(JSON.stringify(cachedLabels));

      // act
      const result = await getAllLabels();

      // assert
      expect(result).toEqual(cachedLabels);
      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        '.cache/labels.json',
        'utf8'
      );
    });

    it('should fetch from API and cache when cache is stale', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
        {
          id: '2',
          name: 'Personal',
          color: 'blue',
          order: 2,
          is_favorite: true,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours old
        isFile: () => true,
      } as any);
      mockFs.writeFileSync.mockImplementation(() => undefined);

      // act
      const result = await getAllLabels();

      // assert
      expect(result).toEqual({
        labels: [
          {
            id: 1,
            name: 'Work',
            color: 'charcoal',
            order: 1,
            is_favorite: false,
          },
          {
            id: 2,
            name: 'Personal',
            color: 'blue',
            order: 2,
            is_favorite: true,
          },
        ],
        total_count: 2,
        cached_at: expect.any(String),
      });
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        '.cache/labels.json',
        expect.stringContaining('"cached_at"')
      );
    });

    it('should create cache directory if it does not exist', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(false);
      mockFs.mkdirSync.mockImplementation(() => undefined);
      mockFs.writeFileSync.mockImplementation(() => undefined);

      // act
      const result = await getAllLabels();

      // assert
      expect(mockFs.mkdirSync).toHaveBeenCalledWith('.cache', {
        recursive: true,
      });
      expect(result).toEqual({
        labels: [
          {
            id: 1,
            name: 'Work',
            color: 'charcoal',
            order: 1,
            is_favorite: false,
          },
        ],
        total_count: 1,
        cached_at: expect.any(String),
      });
    });

    it('should handle cache file read errors by falling back to API', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(),
        isFile: () => true,
      } as any);
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });
      mockFs.writeFileSync.mockImplementation(() => undefined);

      // act
      const result = await getAllLabels();

      // assert
      expect(result).toEqual({
        labels: [
          {
            id: 1,
            name: 'Work',
            color: 'charcoal',
            order: 1,
            is_favorite: false,
          },
        ],
        total_count: 1,
        cached_at: expect.any(String),
      });
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle invalid JSON in cache file by falling back to API', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(),
        isFile: () => true,
      } as any);
      mockFs.readFileSync.mockReturnValue('invalid json content');
      mockFs.writeFileSync.mockImplementation(() => undefined);

      // act
      const result = await getAllLabels();

      // assert
      expect(result).toEqual({
        labels: [
          {
            id: 1,
            name: 'Work',
            color: 'charcoal',
            order: 1,
            is_favorite: false,
          },
        ],
        total_count: 1,
        cached_at: expect.any(String),
      });
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle API errors when cache is invalid', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);
      mockFs.existsSync.mockReturnValue(true);
      mockFs.statSync.mockReturnValue({
        mtime: new Date(),
        isFile: () => true,
      } as any);
      mockFs.readFileSync.mockReturnValue('invalid json content');

      // act
      const promise = getAllLabels();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get all labels: API Error'
      );
    });
  });

  describe('getProjectLabels', () => {
    it('should return only project labels when API call succeeds', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
        {
          id: '2',
          name: 'PROJECT:Website Redesign',
          color: 'blue',
          order: 2,
          is_favorite: true,
        },
        {
          id: '3',
          name: 'Urgent',
          color: 'red',
          order: 3,
          is_favorite: false,
        },
        {
          id: '4',
          name: 'PROJECT:Mobile App',
          color: 'green',
          order: 4,
          is_favorite: false,
        },
        {
          id: '5',
          name: 'PROJECT:Marketing Campaign',
          color: 'purple',
          order: 5,
          is_favorite: true,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getProjectLabels();

      // assert
      expect(result.labels).toHaveLength(3);
      expect(result.labels[0].id).toBe(2);
      expect(result.labels[0].name).toBe('PROJECT:Website Redesign');
      expect(result.labels[0].color).toBe('blue');
      expect(result.labels[1].name).toBe('PROJECT:Mobile App');
      expect(result.labels[2].name).toBe('PROJECT:Marketing Campaign');
      expect(result.total_count).toBe(3);
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getProjectLabels();

      // assert
      expect(result.labels).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle response with no project labels', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
        {
          id: '2',
          name: 'Personal',
          color: 'blue',
          order: 2,
          is_favorite: true,
        },
        {
          id: '3',
          name: 'Urgent',
          color: 'red',
          order: 3,
          is_favorite: false,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getProjectLabels();

      // assert
      expect(result.labels).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = getProjectLabels();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get project labels: API Error'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });
  });

  describe('getContextLabels', () => {
    it('should return only context labels when API call succeeds', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
        {
          id: '2',
          name: 'PROJECT:Website Redesign',
          color: 'blue',
          order: 2,
          is_favorite: true,
        },
        {
          id: '3',
          name: 'context:home',
          color: 'red',
          order: 3,
          is_favorite: false,
        },
        {
          id: '4',
          name: 'context:office',
          color: 'green',
          order: 4,
          is_favorite: false,
        },
        {
          id: '5',
          name: 'context:mobile',
          color: 'purple',
          order: 5,
          is_favorite: true,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getContextLabels();

      // assert
      expect(result.labels).toHaveLength(3);
      expect(result.labels[0].id).toBe(3);
      expect(result.labels[0].name).toBe('context:home');
      expect(result.labels[0].color).toBe('red');
      expect(result.labels[1].name).toBe('context:office');
      expect(result.labels[2].name).toBe('context:mobile');
      expect(result.total_count).toBe(3);
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle empty response', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: [] }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getContextLabels();

      // assert
      expect(result.labels).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle response with no context labels', async () => {
      // arrange
      const mockLabels = [
        {
          id: '1',
          name: 'Work',
          color: 'charcoal',
          order: 1,
          is_favorite: false,
        },
        {
          id: '2',
          name: 'PROJECT:Website Redesign',
          color: 'blue',
          order: 2,
          is_favorite: true,
        },
        {
          id: '3',
          name: 'Urgent',
          color: 'red',
          order: 3,
          is_favorite: false,
        },
      ];
      const mockClient = {
        get: vi.fn().mockResolvedValue({ data: mockLabels }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await getContextLabels();

      // assert
      expect(result.labels).toHaveLength(0);
      expect(result.total_count).toBe(0);
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = getContextLabels();

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to get context labels: API Error'
      );
      expect(mockClient.get).toHaveBeenCalledWith('/labels');
    });
  });

  describe('createProjectLabel', () => {
    it('should create a project label successfully', async () => {
      // arrange
      const mockCreatedLabel = {
        id: '123',
        name: 'PROJECT: New Website',
        color: 'charcoal',
        order: 1,
        is_favorite: false,
      };
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockResolvedValue({ data: mockCreatedLabel }),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const result = await createProjectLabel('PROJECT: New Website');

      // assert
      expect(result).toEqual({
        id: 123,
        name: 'PROJECT: New Website',
        color: 'charcoal',
        order: 1,
        is_favorite: false,
      });
      expect(mockClient.post).toHaveBeenCalledWith('/labels', {
        name: 'PROJECT: New Website',
        color: 'charcoal',
      });
    });

    it('should reject input without PROJECT: prefix', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn(),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = createProjectLabel('New Website');

      // assert
      await expect(promise).rejects.toThrow(
        'Project label name must start with "PROJECT: "'
      );
      expect(mockClient.post).not.toHaveBeenCalled();
    });

    it('should reject input with PROJECT: prefix but no space', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn(),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = createProjectLabel('PROJECT:New Website');

      // assert
      await expect(promise).rejects.toThrow(
        'Project label name must start with "PROJECT: "'
      );
      expect(mockClient.post).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockRejectedValue(new Error('API Error')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = createProjectLabel('PROJECT: Test Project');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to create project label: API Error'
      );
      expect(mockClient.post).toHaveBeenCalledWith('/labels', {
        name: 'PROJECT: Test Project',
        color: 'charcoal',
      });
    });

    it('should handle empty project name', async () => {
      // arrange
      const mockClient = {
        get: vi.fn(),
        post: vi.fn().mockRejectedValue(new Error('Invalid name')),
      };
      mockGetTodoistClient.mockReturnValue(mockClient);

      // act
      const promise = createProjectLabel('PROJECT: ');

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to create project label: Invalid name'
      );
      expect(mockClient.post).toHaveBeenCalledWith('/labels', {
        name: 'PROJECT: ',
        color: 'charcoal',
      });
    });
  });
});
