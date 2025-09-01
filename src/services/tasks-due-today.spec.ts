import { getTodoistClient } from './client';
import { getTasksDueToday } from './tasks-due-today';

// Mock the client module
vi.mock('./client');

const mockGetTodoistClient = getTodoistClient as ReturnType<typeof vi.fn>;

// Define the filter query for better readability
const DUE_TODAY_FILTER = [
  '(today | overdue)',
  '& !##Tickler',
  '& !##Brian tickler',
  '& !##Ansonia Tickler',
  '& !##Someday',
  '& !##Brian someday',
  '& !##Brian inbox - per Becky',
  '& !##Becky inbox - per Brian',
  '& !##Shopping list',
  '& !##Becky acknowledged',
  '& !##Chores',
  '& !##rent',
  '& (!##BABY',
  '& !###BrianBabyFocus',
  '& !##Home Preparation',
  '& !##Cards',
  '& !##Hospital Preparation',
  '& !##Baby Care Book',
  '& !##To Pack',
  '& !##Hospital Stay',
  '& !##Post Partum',
  '& !##Questions and Concerns',
  '& !##Research',
  '& !##BabyClassNotes',
  '& !##CarPreparation',
  '& !##Food',
  '& !##Before Hospital Stay)',
  '& !##Daily Chores',
  '& !##Baby Research',
  '& !##Becky someday',
].join(' ');

describe('getTasksDueToday', () => {
  it('should fetch tasks due today with the correct filter', async () => {
    // arrange
    const mockTasks = [
      {
        id: '123',
        content: 'Complete project report',
        description: 'Finish the quarterly report',
        is_completed: false,
        labels: ['work', 'priority'],
        priority: 3,
        due: {
          date: '2024-01-15',
          string: 'today',
          lang: 'en',
          is_recurring: false,
        },
        url: 'https://todoist.com/showTask?id=123',
        comment_count: 0,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
      },
      {
        id: '456',
        content: 'Buy groceries',
        description: 'Milk, bread, eggs',
        is_completed: false,
        labels: ['personal'],
        priority: 2,
        due: {
          date: '2024-01-15',
          string: 'today',
          lang: 'en',
          is_recurring: false,
        },
        url: 'https://todoist.com/showTask?id=456',
        comment_count: 1,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
      },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksDueToday();

    // assert
    expect(result.tasks).toHaveLength(2);
    expect(result.total_count).toBe(2);
    expect(result.tasks[0].content).toBe('Complete project report');
    expect(result.tasks[1].content).toBe('Buy groceries');
    expect(mockClient.get).toHaveBeenCalledWith(
      `/tasks?filter=${encodeURIComponent(DUE_TODAY_FILTER)}`
    );
  });

  it('should handle empty response', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksDueToday();

    // assert
    expect(result.tasks).toHaveLength(0);
    expect(result.total_count).toBe(0);
  });

  it('should handle API error', async () => {
    // arrange
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTasksDueToday();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get tasks due today: API Error'
    );
  });

  it('should handle axios error with response data', async () => {
    // arrange
    const axiosError = {
      isAxiosError: true,
      response: {
        data: { error: 'Rate limit exceeded' },
      },
      message: 'Request failed',
    };
    const mockClient = {
      get: vi.fn().mockRejectedValue(axiosError),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTasksDueToday();

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get tasks due today: Rate limit exceeded'
    );
  });

  it('should map task properties correctly', async () => {
    // arrange
    const mockTasks = [
      {
        id: '789',
        content: 'Test task',
        description: 'Test description',
        is_completed: true,
        labels: ['test'],
        priority: 1,
        due: {
          date: '2024-01-15',
          string: 'today',
          lang: 'en',
          is_recurring: true,
        },
        url: 'https://todoist.com/showTask?id=789',
        comment_count: 5,
        created_at: '2024-01-10T10:00:00Z',
        updated_at: '2024-01-10T10:00:00Z',
      },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockTasks }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTasksDueToday();

    // assert
    expect(result.tasks[0]).toEqual({
      id: 789,
      content: 'Test task',
      description: 'Test description',
      is_completed: true,
      labels: ['test'],
      priority: 1,
      due_date: '2024-01-15',
      url: 'https://todoist.com/showTask?id=789',
      comment_count: 5,
    });
  });
});
