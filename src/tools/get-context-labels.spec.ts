import { getContextLabelsHandler } from './get-context-labels';
import type { MockedFunction } from "vitest";
import { getContextLabels } from '../services/labels';

// Mock the labels service
vi.mock('../services/labels');

const mockGetContextLabels = getContextLabels as MockedFunction<
  typeof getContextLabels
>;

describe('getContextLabelsHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return context labels when API call succeeds', async () => {
    // arrange
    const mockContextLabels = {
      labels: [
        {
          id: 1,
          name: 'context:home',
          color: 'red',
          order: 1,
          is_favorite: false,
        },
        {
          id: 2,
          name: 'context:office',
          color: 'blue',
          order: 2,
          is_favorite: true,
        },
        {
          id: 3,
          name: 'context:mobile',
          color: 'green',
          order: 3,
          is_favorite: false,
        },
      ],
      total_count: 3,
    };
    mockGetContextLabels.mockResolvedValue(mockContextLabels);

    // act
    const result = await getContextLabelsHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockContextLabels, null, 2),
        },
      ],
    });
    expect(mockGetContextLabels).toHaveBeenCalledTimes(1);
  });

  it('should handle empty context labels response', async () => {
    // arrange
    const mockEmptyResponse = {
      labels: [],
      total_count: 0,
    };
    mockGetContextLabels.mockResolvedValue(mockEmptyResponse);

    // act
    const result = await getContextLabelsHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(mockEmptyResponse, null, 2),
        },
      ],
    });
    expect(mockGetContextLabels).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    // arrange
    const errorMessage = 'Failed to get context labels: API Error';
    mockGetContextLabels.mockRejectedValue(new Error(errorMessage));

    // act
    const promise = getContextLabelsHandler();

    // assert
    await expect(promise).rejects.toThrow(errorMessage);
    expect(mockGetContextLabels).toHaveBeenCalledTimes(1);
  });
});
