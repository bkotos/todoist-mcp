import {
  createTaskTool,
  updateTaskTool,
  moveTaskTool,
  completeTaskTool,
  uncompleteTaskTool,
  completeBeckyTaskTool,
} from './task-operations';
import type { MockedFunction } from 'vitest';
import {
  createTask,
  updateTask,
  moveTask,
  completeTask,
  uncompleteTask,
  completeBeckyTask,
} from '../services/tasks/task-update';

vi.mock('../services/tasks/task-update');

const mockCreateTask = createTask as MockedFunction<typeof createTask>;
const mockUpdateTask = updateTask as MockedFunction<typeof updateTask>;
const mockMoveTask = moveTask as MockedFunction<typeof moveTask>;
const mockCompleteTask = completeTask as MockedFunction<typeof completeTask>;
const mockUncompleteTask = uncompleteTask as MockedFunction<
  typeof uncompleteTask
>;
const mockCompleteBeckyTask = completeBeckyTask as MockedFunction<
  typeof completeBeckyTask
>;

describe('Task Operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createTaskTool', () => {
    it('should create a task successfully with all parameters', async () => {
      // arrange
      mockCreateTask.mockResolvedValue('Task created successfully: Test task');

      // act
      const result = await createTaskTool.handler({
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
      mockCreateTask.mockResolvedValue(
        'Task created successfully: Simple task'
      );

      // act
      const result = await createTaskTool.handler({
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
      const promise = createTaskTool.handler(args);

      // assert
      await expect(promise).rejects.toThrow('title is required');
    });

    it('should handle service errors gracefully', async () => {
      // arrange
      mockCreateTask.mockRejectedValue(new Error('API Error'));

      // act
      const result = await createTaskTool.handler({
        title: 'Test task',
      });

      // assert
      expect(result.content[0].text).toContain('Error: API Error');
    });

    it('should handle unknown errors', async () => {
      // arrange
      mockCreateTask.mockRejectedValue('Unknown error');

      // act
      const result = await createTaskTool.handler({
        title: 'Test task',
      });

      // assert
      expect(result.content[0].text).toContain('Error: Unknown error');
    });
  });

  describe('updateTaskTool', () => {
    it('should have correct schema structure', () => {
      // arrange & act
      const schema = updateTaskTool.schema;

      // assert
      expect(schema.name).toBe('update_task');
      expect(schema.description).toContain('Update a Todoist task');
      expect(schema.inputSchema.type).toBe('object');
      expect(schema.inputSchema.properties).toBeDefined();
      expect(schema.inputSchema.required).toContain('task_id');
    });

    it('should update task title successfully', async () => {
      // arrange
      const args = {
        task_id: '123',
        title: 'Updated Task Title',
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskTool.handler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Task updated successfully');
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: '123',
        title: 'Updated Task Title',
      });
    });

    it('should update multiple fields successfully', async () => {
      // arrange
      const args = {
        task_id: '123',
        title: 'Updated Title',
        description: 'Updated description',
        priority: 2,
        labels: ['work'],
        due_string: 'tomorrow',
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskTool.handler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Task updated successfully');
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: '123',
        title: 'Updated Title',
        description: 'Updated description',
        priority: 2,
        labels: ['work'],
        dueString: 'tomorrow',
      });
    });

    it('should handle service errors gracefully', async () => {
      // arrange
      const args = {
        task_id: '123',
        title: 'Updated Title',
      };
      mockUpdateTask.mockRejectedValue(new Error('API Error'));

      // act
      const result = await updateTaskTool.handler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Error: API Error');
    });

    it('should throw error when task_id is missing', async () => {
      // arrange
      const args = {
        title: 'Updated Title',
      };

      // act
      const promise = updateTaskTool.handler(args as any);

      // assert
      await expect(promise).rejects.toThrow('task_id is required');
    });
  });

  describe('moveTaskTool', () => {
    it('should successfully move a task', async () => {
      // arrange
      mockMoveTask.mockResolvedValue();

      // act
      const result = await moveTaskTool.handler({
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
      const promise = moveTaskTool.handler({
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
      const promise = moveTaskTool.handler({
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
      const result = await moveTaskTool.handler({
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

  describe('completeTaskTool', () => {
    it('should complete a task successfully', async () => {
      // arrange
      mockCompleteTask.mockResolvedValue('Task completed successfully');

      // act
      const result = await completeTaskTool.handler({ task_id: '123' });

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
      const result = await completeTaskTool.handler({ task_id: '123' });

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

  describe('uncompleteTaskTool', () => {
    it('should uncomplete a task successfully', async () => {
      // arrange
      mockUncompleteTask.mockResolvedValue();

      // act
      const result = await uncompleteTaskTool.handler({ task_id: '123' });

      // assert
      expect(result.content[0].text).toBe('Task uncompleted successfully');
      expect(mockUncompleteTask).toHaveBeenCalledWith('123');
    });

    it('should handle error when uncompleting task', async () => {
      // arrange
      mockUncompleteTask.mockRejectedValue(new Error('API Error'));

      // act
      const result = await uncompleteTaskTool.handler({ task_id: '123' });

      // assert
      expect(result.content[0].text).toBe('Error: API Error');
    });
  });

  describe('completeBeckyTaskTool', () => {
    it('should complete Becky task successfully', async () => {
      // arrange
      mockCompleteBeckyTask.mockResolvedValue();

      // act
      const result = await completeBeckyTaskTool.handler({ task_id: '123' });

      // assert
      expect(result.content[0].text).toContain('Task completed successfully');
      expect(mockCompleteBeckyTask).toHaveBeenCalledWith('123');
    });

    it('should handle error when completing Becky task', async () => {
      // arrange
      mockCompleteBeckyTask.mockRejectedValue(new Error('API Error'));

      // act
      const result = await completeBeckyTaskTool.handler({ task_id: '123' });

      // assert
      expect(result.content[0].text).toBe('Error: API Error');
    });
  });
});
