import { getTasksWithLabelHandler } from './get-tasks-with-label';
import type { MockedFunction } from "vitest";
import { getTasksWithLabel } from '../services/tasks';

// Mock the tasks service
vi.mock('../services/tasks');
const mockGetTasksWithLabel = getTasksWithLabel as MockedFunction<
  typeof getTasksWithLabel
>;

describe('getTasksWithLabelHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return JSON formatted tasks with label when API call succeeds', async () => {
    // arrange
    const mockTasks = [
      {
        id: 1,
        content: 'Test task with urgent label',
        description: 'Test description 1',
        is_completed: false,
        labels: ['urgent'],
        priority: 1,
        due_date: '2024-01-01',
        url: 'https://todoist.com/task/1',
        comment_count: 2,
      },
      {
        id: 2,
        content: 'Another urgent task',
        description: 'Test description 2',
        is_completed: false,
        labels: ['urgent', 'work'],
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
    mockGetTasksWithLabel.mockResolvedValue(mockResponse);

    // act
    const result = await getTasksWithLabelHandler({ label: 'urgent' });

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    expect(mockGetTasksWithLabel).toHaveBeenCalledWith('urgent');
  });

  it('should handle empty response', async () => {
    // arrange
    const mockResponse = {
      tasks: [],
      total_count: 0,
    };
    mockGetTasksWithLabel.mockResolvedValue(mockResponse);

    // act
    const result = await getTasksWithLabelHandler({ label: 'nonexistent' });

    // assert
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('text');
    expect(result.content[0].text).toBe(JSON.stringify(mockResponse, null, 2));
    expect(mockGetTasksWithLabel).toHaveBeenCalledWith('nonexistent');
  });

  it('should handle API errors', async () => {
    // arrange
    mockGetTasksWithLabel.mockRejectedValue(new Error('API Error'));

    // act
    const promise = getTasksWithLabelHandler({ label: 'urgent' });

    // assert
    await expect(promise).rejects.toThrow('API Error');
    expect(mockGetTasksWithLabel).toHaveBeenCalledWith('urgent');
  });
});
