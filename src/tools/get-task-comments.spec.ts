import { getTaskCommentsHandler } from './get-task-comments';
import { getTaskComments } from '../services/todoist';

// Mock the services
jest.mock('../services/todoist');

const mockGetTaskComments = getTaskComments as jest.MockedFunction<
  typeof getTaskComments
>;

describe('get-task-comments Tool', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getTaskCommentsHandler', () => {
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
      const response = await getTaskCommentsHandler({ task_id: '123' });

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
      const response = await getTaskCommentsHandler({ task_id: '123' });
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
      const response = await getTaskCommentsHandler({ task_id: '123' });
      const stringified = response.content[0].text;

      // assert
      expect(stringified).toContain('"comments": []');
      expect(stringified).toContain('"total_count": 0');
    });

    it('should throw error when task_id is missing', async () => {
      // arrange
      const args = {} as { task_id: string };

      // act
      const promise = getTaskCommentsHandler(args);

      // assert
      await expect(promise).rejects.toThrow('task_id is required');
    });
  });
});
