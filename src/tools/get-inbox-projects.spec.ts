import { getInboxProjects } from '../services/project-filters';

// Mock the project-filters service
jest.mock('../services/project-filters');
const mockGetInboxProjects = getInboxProjects as jest.MockedFunction<
  typeof getInboxProjects
>;

describe('get-inbox-projects tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return inbox projects data', async () => {
    // arrange
    const mockProjects = [
      {
        id: 2,
        name: 'Inbox',
        url: 'https://todoist.com/project/2',
        is_favorite: false,
        is_inbox: true,
      },
      {
        id: 16,
        name: 'Brian inbox - per Becky',
        url: 'https://todoist.com/project/16',
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
