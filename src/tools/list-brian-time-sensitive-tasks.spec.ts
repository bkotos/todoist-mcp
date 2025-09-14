import { listBrianTimeSensitiveTasksHandler } from './list-brian-time-sensitive-tasks';
import type { MockedFunction } from 'vitest';
import { listBrianTimeSensitiveTasks } from '../services/tasks';

// Mock the tasks service
vi.mock('../services/tasks');
const mockListBrianTimeSensitiveTasks =
  listBrianTimeSensitiveTasks as MockedFunction<
    typeof listBrianTimeSensitiveTasks
  >;

describe('listBrianTimeSensitiveTasksHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return JSON formatted Brian time sensitive tasks when API call succeeds', async () => {
    // arrange
    const mockTasks = [
      {
        id: 1,
        content: 'Test Brian time sensitive task 1',
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
        content: 'Test Brian time sensitive task 2',
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
    mockListBrianTimeSensitiveTasks.mockResolvedValue(mockResponse);

    // act
    const result = await listBrianTimeSensitiveTasksHandler();

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    expect(mockListBrianTimeSensitiveTasks).toHaveBeenCalledTimes(1);
  });

  it('should handle empty response', async () => {
    // arrange
    const mockResponse = {
      tasks: [],
      total_count: 0,
    };
    mockListBrianTimeSensitiveTasks.mockResolvedValue(mockResponse);

    // act
    const result = await listBrianTimeSensitiveTasksHandler();

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    expect(mockListBrianTimeSensitiveTasks).toHaveBeenCalledTimes(1);
  });

  it('should handle API errors', async () => {
    // arrange
    mockListBrianTimeSensitiveTasks.mockRejectedValue(new Error('API Error'));

    // act
    const promise = listBrianTimeSensitiveTasksHandler();

    // assert
    await expect(promise).rejects.toThrow('API Error');
    expect(mockListBrianTimeSensitiveTasks).toHaveBeenCalledTimes(1);
  });
});
