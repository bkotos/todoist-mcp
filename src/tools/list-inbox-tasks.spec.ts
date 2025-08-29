import { listInboxTasksHandler } from './list-inbox-tasks';
import * as todoistService from '../services/todoist';

jest.mock('../services/todoist');

const mockListInboxTasks = todoistService.listInboxTasks as jest.MockedFunction<
  typeof todoistService.listInboxTasks
>;

describe('listInboxTasksHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted JSON response when tasks are found', async () => {
    // arrange
    const mockTasks = [
      {
        id: 1,
        content: 'Test inbox task 1',
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
        content: 'Test inbox task 2',
        description: 'Test description 2',
        is_completed: true,
        labels: [],
        priority: 2,
        due_date: null,
        url: 'https://todoist.com/task/2',
        comment_count: 0,
      },
    ];
    mockListInboxTasks.mockResolvedValue({
      tasks: mockTasks,
      total_count: 2,
    });

    // act
    const result = await listInboxTasksHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              tasks: mockTasks,
              total_count: 2,
            },
            null,
            2
          ),
        },
      ],
    });
    expect(mockListInboxTasks).toHaveBeenCalled();
  });

  it('should return empty tasks response when no tasks are found', async () => {
    // arrange
    mockListInboxTasks.mockResolvedValue({
      tasks: [],
      total_count: 0,
    });

    // act
    const result = await listInboxTasksHandler();

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              tasks: [],
              total_count: 0,
            },
            null,
            2
          ),
        },
      ],
    });
    expect(mockListInboxTasks).toHaveBeenCalled();
  });

  it('should handle API errors gracefully', async () => {
    // arrange
    mockListInboxTasks.mockRejectedValue(new Error('API Error'));

    // act
    const promise = listInboxTasksHandler();

    // assert
    await expect(promise).rejects.toThrow('API Error');
    expect(mockListInboxTasks).toHaveBeenCalled();
  });
});
