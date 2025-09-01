import { updateTaskSchema, updateTaskHandler } from './update-task';
import type { MockedFunction } from "vitest";
import { updateTask } from '../services/task-updates';

// Mock the service module
vi.mock('../services/task-updates');

const mockUpdateTask = updateTask as MockedFunction<typeof updateTask>;

describe('updateTask Tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateTaskSchema', () => {
    it('should have correct schema structure', () => {
      // arrange & act
      const schema = updateTaskSchema;

      // assert
      expect(schema.name).toBe('update_task');
      expect(schema.description).toContain('Update a Todoist task');
      expect(schema.inputSchema.type).toBe('object');
      expect(schema.inputSchema.properties).toBeDefined();
      expect(schema.inputSchema.required).toContain('task_id');
    });

    it('should have all required properties in schema', () => {
      // arrange & act
      const properties = updateTaskSchema.inputSchema.properties;

      // assert
      expect(properties.task_id).toBeDefined();
      expect(properties.title).toBeDefined();
      expect(properties.description).toBeDefined();
      expect(properties.labels).toBeDefined();
      expect(properties.priority).toBeDefined();
      expect(properties.due_date).toBeDefined();
    });

    it('should have correct property types', () => {
      // arrange & act
      const properties = updateTaskSchema.inputSchema.properties;

      // assert
      expect(properties.task_id.type).toBe('string');
      expect(properties.title.type).toBe('string');
      expect(properties.description.type).toBe('string');
      expect(properties.labels.type).toBe('array');
      expect(properties.priority.type).toBe('number');
      expect(properties.due_date.type).toBe('string');
    });
  });

  describe('updateTaskHandler', () => {
    it('should update task title successfully', async () => {
      // arrange
      const args = {
        task_id: '123',
        title: 'Updated Task Title',
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskHandler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Task updated successfully');
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: '123',
        title: 'Updated Task Title',
      });
    });

    it('should update task description successfully', async () => {
      // arrange
      const args = {
        task_id: '123',
        description: 'Updated description',
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskHandler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Task updated successfully');
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: '123',
        description: 'Updated description',
      });
    });

    it('should update task labels successfully', async () => {
      // arrange
      const args = {
        task_id: '123',
        labels: ['work', 'urgent'],
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskHandler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Task updated successfully');
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: '123',
        labels: ['work', 'urgent'],
      });
    });

    it('should update task priority successfully', async () => {
      // arrange
      const args = {
        task_id: '123',
        priority: 3,
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskHandler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Task updated successfully');
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: '123',
        priority: 3,
      });
    });

    it('should update task due date successfully', async () => {
      // arrange
      const args = {
        task_id: '123',
        due_date: '2024-01-15',
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskHandler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Task updated successfully');
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: '123',
        dueDate: '2024-01-15',
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
        due_date: '2024-01-15',
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskHandler(args);

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
        dueDate: '2024-01-15',
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
      const result = await updateTaskHandler(args);

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
      const promise = updateTaskHandler(args as any);

      // assert
      await expect(promise).rejects.toThrow('task_id is required');
    });

    it('should only pass provided fields to service', async () => {
      // arrange
      const args = {
        task_id: '123',
        title: 'Updated Title',
        // Note: other fields are not provided
      };
      mockUpdateTask.mockResolvedValue('Task updated successfully');

      // act
      const result = await updateTaskHandler(args);

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toContain('Task updated successfully');
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: '123',
        title: 'Updated Title',
      });
      // Ensure no undefined fields are passed
      expect(mockUpdateTask).not.toHaveBeenCalledWith(
        expect.objectContaining({
          description: undefined,
          labels: undefined,
          priority: undefined,
          dueDate: undefined,
        })
      );
    });
  });
});
