import { completeTaskHandler } from './complete-task';
import type { MockedFunction } from "vitest";
import { completeTask } from '../services/complete-task';

vi.mock('../services/complete-task');

const mockCompleteTask = completeTask as MockedFunction<
  typeof completeTask
>;

describe('completeTaskHandler', () => {
  it('should complete a task successfully', async () => {
    // arrange
    mockCompleteTask.mockResolvedValue('Task completed successfully');

    // act
    const result = await completeTaskHandler({ task_id: '123' });

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'Task completed successfully',
        },
      ],
    });
    expect(mockCompleteTask).toHaveBeenCalledWith('123');
  });

  it('should handle error when completing task', async () => {
    // arrange
    mockCompleteTask.mockRejectedValue(new Error('API Error'));

    // act
    const result = await completeTaskHandler({ task_id: '123' });

    // assert
    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'Error: API Error',
        },
      ],
    });
  });
});
