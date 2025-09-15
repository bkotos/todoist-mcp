import { getInboxProjects } from '../services/project-filters';
import type { MockedFunction } from 'vitest';

// Mock the project-filters service
vi.mock('../services/project-filters');
const mockGetInboxProjects = getInboxProjects as MockedFunction<
  typeof getInboxProjects
>;

describe('get-inbox-projects tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return inbox projects data', async () => {
    // arrange
    const mockProjects = [
      {
        id: 2,
        name: 'Inbox',
        url: 'https://todoist.com/project/2',
        is_favorite: false,
        is_inbox_project: true,
      },
      {
        id: 16,
        name: 'Brian inbox - per Becky',
        url: 'https://todoist.com/project/16',
        is_favorite: false,
        is_inbox_project: false,
      },
      {
        id: 24,
        name: 'Becky inbox - per Brian',
        url: 'https://todoist.com/project/24',
        is_favorite: false,
        is_inbox_project: false,
      },
    ];
    const mockResult = {
      projects: mockProjects,
      total_count: 3,
    };
    mockGetInboxProjects.mockResolvedValue(mockResult);

    // act
    const result = await getInboxProjects();

    // assert
    expect(result).toEqual(mockResult);
    expect(mockGetInboxProjects).toHaveBeenCalledTimes(1);
  });

  it('should handle error when service fails', async () => {
    // arrange
    mockGetInboxProjects.mockRejectedValue(new Error('API Error'));

    // act
    const promise = getInboxProjects();

    // assert
    await expect(promise).rejects.toThrow('API Error');
  });
});
