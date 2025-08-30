import { getBrianOnlyProjects } from '../services/project-filters';

// Mock the project-filters service
jest.mock('../services/project-filters');
const mockGetBrianOnlyProjects = getBrianOnlyProjects as jest.MockedFunction<
  typeof getBrianOnlyProjects
>;

describe('get-brian-only-projects tool', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return Brian-only projects data', async () => {
    // arrange
    const mockProjects = [
      {
        id: 1,
        name: 'Areas of focus',
        url: 'https://todoist.com/project/1',
        is_favorite: false,
        is_inbox: false,
      },
      {
        id: 2,
        name: 'Inbox',
        url: 'https://todoist.com/project/2',
        is_favorite: false,
        is_inbox: true,
      },
      {
        id: 3,
        name: 'Media',
        url: 'https://todoist.com/project/3',
        is_favorite: false,
        is_inbox: false,
      },
    ];
    const mockResult = {
      projects: mockProjects,
      total_count: 3,
    };
    mockGetBrianOnlyProjects.mockResolvedValue(mockResult);

    // act
    const result = await getBrianOnlyProjects();

    // assert
    expect(result).toEqual(mockResult);
    expect(mockGetBrianOnlyProjects).toHaveBeenCalledTimes(1);
  });

  it('should handle error when service fails', async () => {
    // arrange
    mockGetBrianOnlyProjects.mockRejectedValue(new Error('API Error'));

    // act
    const promise = getBrianOnlyProjects();

    // assert
    await expect(promise).rejects.toThrow('API Error');
  });
});
