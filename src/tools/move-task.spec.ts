import { moveTaskHandler } from './move-task';
import * as moveTaskService from '../services/move-task';

// Mock the move-task service
jest.mock('../services/move-task');

const mockMoveTask = moveTaskService.moveTask as jest.MockedFunction<
  typeof moveTaskService.moveTask
>;

describe('Move Task Tool', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('moveTaskHandler', () => {
    it('should successfully move a task', async () => {
      // arrange
      mockMoveTask.mockResolvedValue();

      // act
      const result = await moveTaskHandler({
        task_id: 'task_123',
        project_id: 'project_456',
      });

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe(
        'Task task_123 successfully moved to project project_456'
      );
      expect(mockMoveTask).toHaveBeenCalledWith('task_123', 'project_456');
    });

    it('should handle missing task_id', async () => {
      // arrange
      mockMoveTask.mockResolvedValue();

      // act
      const promise = moveTaskHandler({
        task_id: '',
        project_id: 'project_456',
      });

      // assert
      await expect(promise).rejects.toThrow('task_id is required');
      expect(mockMoveTask).not.toHaveBeenCalled();
    });

    it('should handle missing project_id', async () => {
      // arrange
      mockMoveTask.mockResolvedValue();

      // act
      const promise = moveTaskHandler({
        task_id: 'task_123',
        project_id: '',
      });

      // assert
      await expect(promise).rejects.toThrow('project_id is required');
      expect(mockMoveTask).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // arrange
      mockMoveTask.mockRejectedValue(new Error('Task not found'));

      // act
      const result = await moveTaskHandler({
        task_id: 'invalid_task',
        project_id: 'project_456',
      });

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe('Error: Task not found');
      expect(mockMoveTask).toHaveBeenCalledWith('invalid_task', 'project_456');
    });
  });
});
