import {
  getTaskCommentsTool,
  createTaskCommentTool,
  getContextLabelsTool,
} from './comments';
import type { MockedFunction } from 'vitest';
import { getTaskComments, createTaskComment } from '../services/tasks/comments';
import { getContextLabels } from '../services/labels/labels';

vi.mock('../services/tasks/comments');
vi.mock('../services/labels/labels');

const mockGetTaskComments = getTaskComments as MockedFunction<
  typeof getTaskComments
>;
const mockCreateTaskComment = createTaskComment as MockedFunction<
  typeof createTaskComment
>;
const mockGetContextLabels = getContextLabels as MockedFunction<
  typeof getContextLabels
>;

describe('Comments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTaskCommentsTool', () => {
    it('should format get_task_comments response as text with stringified JSON', async () => {
      // arrange
      const mockCommentsData = {
        comments: [
          {
            id: 1,
            content: 'This is a comment on the task',
            posted: '2023-01-01T00:00:00Z',
            posted_uid: 'user123',
            attachment: null,
          },
        ],
        total_count: 1,
      };
      mockGetTaskComments.mockResolvedValue(mockCommentsData);

      // act
      const response = await getTaskCommentsTool.handler({ task_id: '123' });

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        JSON.stringify(mockCommentsData, null, 2)
      );
      expect(mockGetTaskComments).toHaveBeenCalledWith('123');
    });

    it('should properly stringify comment data with attachments', async () => {
      // arrange
      const mockCommentsData = {
        comments: [
          {
            id: 1,
            content: 'Comment with attachment',
            posted: '2023-01-01T00:00:00Z',
            posted_uid: 'user123',
            attachment: {
              resource_type: 'file',
              file_name: 'document.pdf',
              file_size: 1024,
              file_url: 'https://todoist.com/file/document.pdf',
              upload_state: 'completed',
            },
          },
          {
            id: 2,
            content: 'Simple comment without attachment',
            posted: '2023-01-02T00:00:00Z',
            posted_uid: 'user456',
            attachment: null,
          },
        ],
        total_count: 2,
      };
      mockGetTaskComments.mockResolvedValue(mockCommentsData);

      // act
      const response = await getTaskCommentsTool.handler({ task_id: '123' });
      const stringified = response.content[0].text;

      // assert
      expect(stringified).toContain('"id": 1');
      expect(stringified).toContain('"content": "Comment with attachment"');
      expect(stringified).toContain('"posted": "2023-01-01T00:00:00Z"');
      expect(stringified).toContain('"posted_uid": "user123"');
      expect(stringified).toContain('"file_name": "document.pdf"');
      expect(stringified).toContain('"total_count": 2');
    });

    it('should handle empty comments list', async () => {
      // arrange
      const mockEmptyData = {
        comments: [],
        total_count: 0,
      };
      mockGetTaskComments.mockResolvedValue(mockEmptyData);

      // act
      const response = await getTaskCommentsTool.handler({ task_id: '123' });
      const stringified = response.content[0].text;

      // assert
      expect(stringified).toContain('"comments": []');
      expect(stringified).toContain('"total_count": 0');
    });

    it('should throw error when task_id is missing', async () => {
      // arrange
      const args = {} as { task_id: string };

      // act
      const promise = getTaskCommentsTool.handler(args);

      // assert
      await expect(promise).rejects.toThrow('task_id is required');
    });
  });

  describe('createTaskCommentTool', () => {
    it('should create a new comment on a task successfully', async () => {
      // arrange
      const mockTaskId = '123';
      const mockContent = 'This is a test comment';
      const mockComment = {
        id: 456,
        content: 'This is a test comment\n\n*(commented using Claude)*',
        posted: '2024-01-03T12:00:00Z',
        posted_uid: 'user1',
        attachment: null,
      };

      mockCreateTaskComment.mockResolvedValue(mockComment);

      // act
      const result = await createTaskCommentTool.handler({
        task_id: mockTaskId,
        content: mockContent,
      });

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const responseData = JSON.parse(result.content[0].text);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe('Comment created successfully');
      expect(responseData.comment.id).toBe(456);
      expect(responseData.comment.content).toBe(
        'This is a test comment\n\n*(commented using Claude)*'
      );
      expect(responseData.comment.posted_uid).toBe('user1');

      expect(mockCreateTaskComment).toHaveBeenCalledWith(
        mockTaskId,
        mockContent
      );
    });

    it('should handle error when creating comment fails', async () => {
      // arrange
      const mockTaskId = '123';
      const mockContent = 'This is a test comment';
      const mockError = new Error('API Error');

      mockCreateTaskComment.mockRejectedValue(mockError);

      // act
      const result = await createTaskCommentTool.handler({
        task_id: mockTaskId,
        content: mockContent,
      });

      // assert
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');

      const responseData = JSON.parse(result.content[0].text);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe('Failed to create comment');
      expect(responseData.error).toBe('API Error');

      expect(mockCreateTaskComment).toHaveBeenCalledWith(
        mockTaskId,
        mockContent
      );
    });
  });

  describe('getContextLabelsTool', () => {
    it('should return context labels when API call succeeds', async () => {
      // arrange
      const mockContextLabels = {
        labels: [
          {
            id: 1,
            name: 'context:home',
            color: 'red',
            order: 1,
            is_favorite: false,
          },
          {
            id: 2,
            name: 'context:office',
            color: 'blue',
            order: 2,
            is_favorite: true,
          },
          {
            id: 3,
            name: 'context:mobile',
            color: 'green',
            order: 3,
            is_favorite: false,
          },
        ],
        total_count: 3,
      };
      mockGetContextLabels.mockResolvedValue(mockContextLabels);

      // act
      const result = await getContextLabelsTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockContextLabels, null, 2),
          },
        ],
      });
      expect(mockGetContextLabels).toHaveBeenCalledTimes(1);
    });

    it('should handle empty context labels response', async () => {
      // arrange
      const mockEmptyResponse = {
        labels: [],
        total_count: 0,
      };
      mockGetContextLabels.mockResolvedValue(mockEmptyResponse);

      // act
      const result = await getContextLabelsTool.handler();

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockEmptyResponse, null, 2),
          },
        ],
      });
      expect(mockGetContextLabels).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      // arrange
      const errorMessage = 'Failed to get context labels: API Error';
      mockGetContextLabels.mockRejectedValue(new Error(errorMessage));

      // act
      const promise = getContextLabelsTool.handler();

      // assert
      await expect(promise).rejects.toThrow(errorMessage);
      expect(mockGetContextLabels).toHaveBeenCalledTimes(1);
    });
  });
});
