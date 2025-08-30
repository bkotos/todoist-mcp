import { getAllLabels, getProjectLabels } from './labels';
import { getTodoistClient } from './client';

// Mock the client module
jest.mock('./client');

const mockGetTodoistClient = getTodoistClient as jest.MockedFunction<
  typeof getTodoistClient
>;

describe('Labels Functions', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
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
        get: jest.fn().mockResolvedValue({ data: mockLabels }),
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
        get: jest.fn().mockResolvedValue({ data: [] }),
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
        get: jest.fn().mockRejectedValue(new Error('API Error')),
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
        get: jest.fn().mockResolvedValue({ data: mockLabels }),
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
        get: jest.fn().mockResolvedValue({ data: [] }),
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
        get: jest.fn().mockResolvedValue({ data: mockLabels }),
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
        get: jest.fn().mockRejectedValue(new Error('API Error')),
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
});
