import { getBeckySharedProjects } from '../services/project-filters';
import type { MockedFunction } from 'vitest';

// Mock the project-filters service
vi.mock('../services/project-filters');
const mockGetBeckySharedProjects = getBeckySharedProjects as MockedFunction<
  typeof getBeckySharedProjects
>;

describe('get-becky-shared-projects tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return Becky shared projects data', async () => {
    // arrange
    const mockProjects = [
      {
        id: 23,
        name: 'Becky someday',
        url: 'https://todoist.com/project/23',
        is_favorite: false,
        is_inbox: false,
      },
      {
        id: 24,
        name: 'Becky inbox - per Brian',
        url: 'https://todoist.com/project/24',
        is_favorite: false,
        is_inbox: false,
      },
      {
        id: 25,
        name: 'Becky acknowledged',
        url: 'https://todoist.com/project/25',
        is_favorite: false,
        is_inbox: false,
      },
      {
        id: 26,
        name: 'Becky In Progress',
        url: 'https://todoist.com/project/26',
        is_favorite: false,
        is_inbox: false,
      },
      {
        id: 27,
        name: 'Becky time sensitive (per Brian)',
        url: 'https://todoist.com/project/27',
        is_favorite: false,
        is_inbox: false,
      },
    ];
    const mockResult = {
      projects: mockProjects,
      total_count: 5,
    };
    mockGetBeckySharedProjects.mockResolvedValue(mockResult);

    // act
    const result = await getBeckySharedProjects();

    // assert
    expect(result).toEqual(mockResult);
    expect(mockGetBeckySharedProjects).toHaveBeenCalledTimes(1);
  });

  it('should handle error when service fails', async () => {
    // arrange
    mockGetBeckySharedProjects.mockRejectedValue(new Error('API Error'));

    // act
    const promise = getBeckySharedProjects();

    // assert
    await expect(promise).rejects.toThrow('API Error');
  });
});
