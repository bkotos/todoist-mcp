import { createTaskHandler } from './create-task';
import type { MockedFunction } from 'vitest';
import { createTask } from '../services/tasks/create-task';

vi.mock('../services/tasks/create-task');

const mockCreateTask = createTask as MockedFunction<typeof createTask>;

describe('createTaskHandler', () => {
  it('should create a task successfully with all parameters', async () => {
    // arrange
    mockCreateTask.mockResolvedValue('Task created successfully: Test task');

    // act
    const result = await createTaskHandler({
      title: 'Test task',
      description: 'Test description',
      project_id: '67890',
      labels: ['test-label'],
      priority: 3,
      due_date: '2024-01-15',
    });

    // assert
    expect(result.content[0].text).toContain(
      'Task created successfully: Test task'
    );
    expect(mockCreateTask).toHaveBeenCalledWith({
      title: 'Test task',
      description: 'Test description',
      projectId: '67890',
      labels: ['test-label'],
      priority: 3,
      dueDate: '2024-01-15',
    });
  });

  it('should create a task with minimal required parameters', async () => {
    // arrange
    mockCreateTask.mockResolvedValue('Task created successfully: Simple task');

    // act
    const result = await createTaskHandler({
      title: 'Simple task',
    });

    // assert
    expect(result.content[0].text).toContain(
      'Task created successfully: Simple task'
    );
    expect(mockCreateTask).toHaveBeenCalledWith({
      title: 'Simple task',
    });
  });

  it('should throw error when title is missing', async () => {
    // arrange
    const args = {} as any;

    // act
    const promise = createTaskHandler(args);

    // assert
    await expect(promise).rejects.toThrow('title is required');
  });

  it('should handle service errors gracefully', async () => {
    // arrange
    mockCreateTask.mockRejectedValue(new Error('API Error'));

    // act
    const result = await createTaskHandler({
      title: 'Test task',
    });

    // assert
    expect(result.content[0].text).toContain('Error: API Error');
  });

  it('should handle unknown errors', async () => {
    // arrange
    mockCreateTask.mockRejectedValue('Unknown error');

    // act
    const result = await createTaskHandler({
      title: 'Test task',
    });

    // assert
    expect(result.content[0].text).toContain('Error: Unknown error');
  });
});
