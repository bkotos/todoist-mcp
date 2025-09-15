import type { MockedFunction } from 'vitest';
import { completeBeckyTask } from './complete-becky-task';
import { updateTask } from './task-updates';
import { createAutomatedTaskComment } from './comments';
import { moveTask } from './move-task';
import { listProjects } from '../projects/projects';

vi.mock('./task-updates');
vi.mock('./comments');
vi.mock('./move-task');
vi.mock('../projects/projects');

const mockUpdateTask = updateTask as MockedFunction<typeof updateTask>;
const mockCreateAutomatedTaskComment =
  createAutomatedTaskComment as MockedFunction<
    typeof createAutomatedTaskComment
  >;
const mockMoveTask = moveTask as MockedFunction<typeof moveTask>;
const mockListProjects = listProjects as MockedFunction<typeof listProjects>;

describe('completeBeckyTask', () => {
  describe('when completing a task successfully', () => {
    const mockTaskId = '123';
    const mockBeckyInboxProjectId = '456';
    const mockProjects = {
      projects: [
        {
          id: 456,
          name: 'Becky inbox - per Brian',
          url: 'https://todoist.com/project/456',
          is_favorite: false,
          is_inbox_project: true,
        },
      ],
      total_count: 1,
    };

    beforeEach(() => {
      mockListProjects.mockResolvedValue(mockProjects);
      mockUpdateTask.mockResolvedValue('Task updated successfully');
      mockCreateAutomatedTaskComment.mockResolvedValue({
        id: 1,
        content: 'Test comment',
        posted: '2024-01-01T10:00:00Z',
        posted_uid: 'user1',
        attachment: null,
      });
      mockMoveTask.mockResolvedValue(undefined);
    });

    it('should update the task due string to today', async () => {
      // act
      await completeBeckyTask(mockTaskId);

      // assert
      expect(mockUpdateTask).toHaveBeenCalledWith({
        taskId: mockTaskId,
        dueString: 'today',
      });
    });

    it('should create a comment about task completion', async () => {
      // act
      await completeBeckyTask(mockTaskId);

      // assert
      const expectedCommentContent = `I finished this task. If it looks good to you, please mark as complete. Otherwise, put back in my inbox.`;
      expect(mockCreateAutomatedTaskComment).toHaveBeenCalledWith(
        mockTaskId,
        expectedCommentContent
      );
    });

    it('should move the task to Becky inbox project', async () => {
      // act
      await completeBeckyTask(mockTaskId);

      // assert
      expect(mockMoveTask).toHaveBeenCalledWith(
        mockTaskId,
        mockBeckyInboxProjectId
      );
    });
  });

  it('should handle project not found error', async () => {
    // arrange
    const mockTaskId = '123';
    const mockProjects = {
      projects: [
        {
          id: 999,
          name: 'Some Other Project',
          url: 'https://todoist.com/project/999',
          is_favorite: false,
          is_inbox_project: false,
        },
      ],
      total_count: 1,
    };

    mockListProjects.mockResolvedValue(mockProjects);

    // act
    const promise = completeBeckyTask(mockTaskId);

    // assert
    await expect(promise).rejects.toThrow(
      'Project "Becky inbox - per Brian" not found'
    );
  });

  it('should handle API error when updating task', async () => {
    // arrange
    const mockTaskId = '123';
    const mockProjects = {
      projects: [
        {
          id: 456,
          name: 'Becky inbox - per Brian',
          url: 'https://todoist.com/project/456',
          is_favorite: false,
          is_inbox_project: true,
        },
      ],
      total_count: 1,
    };

    mockListProjects.mockResolvedValue(mockProjects);
    mockUpdateTask.mockRejectedValue(new Error('API Error'));

    // act
    const promise = completeBeckyTask(mockTaskId);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to complete Becky task: API Error'
    );
  });

  it('should handle API error when creating comment', async () => {
    // arrange
    const mockTaskId = '123';
    const mockProjects = {
      projects: [
        {
          id: 456,
          name: 'Becky inbox - per Brian',
          url: 'https://todoist.com/project/456',
          is_favorite: false,
          is_inbox_project: true,
        },
      ],
      total_count: 1,
    };

    mockListProjects.mockResolvedValue(mockProjects);
    mockUpdateTask.mockResolvedValue('Task updated successfully');
    mockCreateAutomatedTaskComment.mockRejectedValue(
      new Error('Comment API Error')
    );

    // act
    const promise = completeBeckyTask(mockTaskId);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to complete Becky task: Comment API Error'
    );
  });

  it('should handle API error when moving task', async () => {
    // arrange
    const mockTaskId = '123';
    const mockProjects = {
      projects: [
        {
          id: 456,
          name: 'Becky inbox - per Brian',
          url: 'https://todoist.com/project/456',
          is_favorite: false,
          is_inbox_project: true,
        },
      ],
      total_count: 1,
    };

    mockListProjects.mockResolvedValue(mockProjects);
    mockUpdateTask.mockResolvedValue('Task updated successfully');
    mockCreateAutomatedTaskComment.mockResolvedValue({
      id: 1,
      content: 'Test comment',
      posted: '2024-01-01T10:00:00Z',
      posted_uid: 'user1',
      attachment: null,
    });
    mockMoveTask.mockRejectedValue(new Error('Move API Error'));

    // act
    const promise = completeBeckyTask(mockTaskId);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to complete Becky task: Move API Error'
    );
  });
});
