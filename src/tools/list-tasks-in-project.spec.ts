import { listTasksInProjectHandler } from './list-tasks-in-project';
import { listTasksInProject } from '../services/todoist';

// Mock the services
jest.mock('../services/todoist');

const mockListTasksInProject = listTasksInProject as jest.MockedFunction<
  typeof listTasksInProject
>;

describe('list-tasks-in-project Tool', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('listTasksInProjectHandler', () => {
    it('should format list_tasks_in_project response as text with stringified JSON', async () => {
      // arrange
      const mockTasksData = {
        tasks: [
          {
            id: 1,
            content: 'Complete project setup',
            description: 'Set up the initial project structure',
            is_completed: false,
            labels: ['setup', 'important'],
            priority: 3,
            due_date: '2023-12-31',
            url: 'https://todoist.com/showTask?id=1',
            comment_count: 2,
          },
        ],
        total_count: 1,
      };
      mockListTasksInProject.mockResolvedValue(mockTasksData);

      // act
      const response = await listTasksInProjectHandler({ project_id: '123' });

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        JSON.stringify(mockTasksData, null, 2)
      );
      expect(mockListTasksInProject).toHaveBeenCalledWith('123');
    });

    it('should properly stringify task data with all fields', async () => {
      // arrange
      const mockTasksData = {
        tasks: [
          {
            id: 1,
            content: 'Complete project setup',
            description: 'Set up the initial project structure',
            is_completed: false,
            labels: ['setup', 'important'],
            priority: 3,
            due_date: '2023-12-31',
            url: 'https://todoist.com/showTask?id=1',
            comment_count: 2,
          },
          {
            id: 2,
            content: 'Review documentation',
            description: 'Go through the project documentation',
            is_completed: true,
            labels: ['review'],
            priority: 2,
            due_date: null,
            url: 'https://todoist.com/showTask?id=2',
            comment_count: 0,
          },
        ],
        total_count: 2,
      };
      mockListTasksInProject.mockResolvedValue(mockTasksData);

      // act
      const response = await listTasksInProjectHandler({ project_id: '123' });
      const stringified = response.content[0].text;

      // assert
      expect(stringified).toContain('"id": 1');
      expect(stringified).toContain('"content": "Complete project setup"');
      expect(stringified).toContain('"is_completed": false');
      expect(stringified).toContain('"priority": 3');
      expect(stringified).toContain('"due_date": "2023-12-31"');
      expect(stringified).toContain('"setup"');
      expect(stringified).toContain('"important"');
      expect(stringified).toContain('"total_count": 2');
    });

    it('should handle empty tasks list', async () => {
      // arrange
      const mockEmptyData = {
        tasks: [],
        total_count: 0,
      };
      mockListTasksInProject.mockResolvedValue(mockEmptyData);

      // act
      const response = await listTasksInProjectHandler({ project_id: '123' });
      const stringified = response.content[0].text;

      // assert
      expect(stringified).toContain('"tasks": []');
      expect(stringified).toContain('"total_count": 0');
    });

    it('should throw error when project_id is missing', async () => {
      // arrange
      const args = {} as { project_id: string };

      // act
      const promise = listTasksInProjectHandler(args);

      // assert
      await expect(promise).rejects.toThrow('project_id is required');
    });
  });
});
