import { getBrianSharedProjects } from '../services/project-filters';
import type { MockedFunction } from 'vitest';

// Mock the project-filters service
vi.mock('../services/project-filters');
const mockGetBrianSharedProjects = getBrianSharedProjects as MockedFunction<
  typeof getBrianSharedProjects
>;

describe('get-brian-shared-projects tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return Brian shared projects data', async () => {
    // arrange
    const mockProjects = [
      {
        id: 16,
        name: 'Brian inbox - per Becky',
        url: 'https://todoist.com/project/16',
        is_favorite: false,
        is_inbox: false,
      },
      {
        id: 17,
        name: 'Brian acknowledged',
        url: 'https://todoist.com/project/17',
        is_favorite: false,
        is_inbox: false,
      },
      {
        id: 18,
        name: 'Brian projects',
        url: 'https://todoist.com/project/18',
        is_favorite: false,
        is_inbox: false,
      },
      {
        id: 28,
        name: 'Brian time sensitive (per Becky)',
        url: 'https://todoist.com/project/28',
        is_favorite: false,
        is_inbox: false,
      },
    ];
    const mockResult = {
      projects: mockProjects,
      total_count: 4,
    };
    mockGetBrianSharedProjects.mockResolvedValue(mockResult);

    // act
    const result = await getBrianSharedProjects();

    // assert
    expect(result).toEqual(mockResult);
    expect(mockGetBrianSharedProjects).toHaveBeenCalledTimes(1);
  });

  it('should handle error when service fails', async () => {
    // arrange
    mockGetBrianSharedProjects.mockRejectedValue(new Error('API Error'));

    // act
    const promise = getBrianSharedProjects();

    // assert
    await expect(promise).rejects.toThrow('API Error');
  });
});
