import { getAllLabels } from './labels';
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
});
