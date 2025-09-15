import { listGtdProjectsHandler } from './list-gtd-projects';
import type { MockedFunction } from 'vitest';
import { listGtdProjects } from '../services/tasks/task-retrieval';

// Mock the tasks service
vi.mock('../services/tasks/task-retrieval');
const mockListGtdProjects = listGtdProjects as MockedFunction<
  typeof listGtdProjects
>;

describe('listGtdProjectsHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return JSON formatted GTD projects when API call succeeds', async () => {
    // arrange
    const mockTasks = [
      {
        id: 1,
        content: 'Test GTD project task 1',
        description: 'Test description 1',
        is_completed: false,
        labels: ['label1'],
        priority: 1,
        due_date: '2024-01-01',
        url: 'https://todoist.com/task/1',
        comment_count: 2,
      },
      {
        id: 2,
        content: 'Test GTD project task 2',
        description: 'Test description 2',
        is_completed: false,
        labels: ['label2'],
        priority: 2,
        due_date: null,
        url: 'https://todoist.com/task/2',
        comment_count: 0,
      },
    ];
    const mockResponse = {
      tasks: mockTasks,
      total_count: 2,
    };
    mockListGtdProjects.mockResolvedValue(mockResponse);

    // act
    const result = await listGtdProjectsHandler();

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    expect(mockListGtdProjects).toHaveBeenCalledTimes(1);
  });

  it('should handle empty response', async () => {
    // arrange
    const mockResponse = {
      tasks: [],
      total_count: 0,
    };
    mockListGtdProjects.mockResolvedValue(mockResponse);

    // act
    const result = await listGtdProjectsHandler();

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    expect(mockListGtdProjects).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    // arrange
    mockListGtdProjects.mockRejectedValue(new Error('API Error'));

    // act
    const promise = listGtdProjectsHandler();

    // assert
    await expect(promise).rejects.toThrow('API Error');
    expect(mockListGtdProjects).toHaveBeenCalledTimes(1);
  });
});
