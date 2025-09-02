import type { MockedFunction } from 'vitest';
import {
  getTaskComments,
  createTaskComment,
  addTaskRenameComment,
  createAutomatedTaskComment,
} from './comments';
import { getTodoistClient } from './client';

vi.mock('./client');

const mockGetTodoistClient = getTodoistClient as MockedFunction<
  typeof getTodoistClient
>;

describe('getTaskComments', () => {
  it('should return structured comments data for a task', async () => {
    // arrange
    const mockTaskId = '123';
    const mockComments = [
      {
        id: '1',
        task_id: '123',
        project_id: '456',
        posted: '2024-01-01T10:00:00Z',
        content: 'Test comment 1',
        attachment: null,
        posted_uid: 'user1',
        uids_to_notify: [],
        is_rtl: false,
        reactions: {},
      },
      {
        id: '2',
        task_id: '123',
        project_id: '456',
        posted: '2024-01-02T11:00:00Z',
        content: 'Test comment 2',
        attachment: {
          resource_type: 'file',
          file_name: 'test.pdf',
          file_size: 1024,
          file_url: 'https://example.com/test.pdf',
          upload_state: 'completed',
        },
        posted_uid: 'user2',
        uids_to_notify: [],
        is_rtl: false,
        reactions: {},
      },
    ];

    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: mockComments }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTaskComments(mockTaskId);

    // assert
    expect(result.comments).toHaveLength(2);
    expect(result.total_count).toBe(2);
    expect(result.comments[0]).toEqual({
      id: 1,
      content: 'Test comment 1',
      posted: '2024-01-01T10:00:00Z',
      posted_uid: 'user1',
      attachment: null,
    });
    expect(result.comments[1]).toEqual({
      id: 2,
      content: 'Test comment 2',
      posted: '2024-01-02T11:00:00Z',
      posted_uid: 'user2',
      attachment: {
        resource_type: 'file',
        file_name: 'test.pdf',
        file_size: 1024,
        file_url: 'https://example.com/test.pdf',
        upload_state: 'completed',
      },
    });
    expect(mockClient.get).toHaveBeenCalledWith(
      `/comments?task_id=${mockTaskId}`
    );
  });

  it('should handle empty comments list', async () => {
    // arrange
    const mockTaskId = '123';
    const mockClient = {
      get: vi.fn().mockResolvedValue({ data: [] }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await getTaskComments(mockTaskId);

    // assert
    expect(result.comments).toHaveLength(0);
    expect(result.total_count).toBe(0);
    expect(mockClient.get).toHaveBeenCalledWith(
      `/comments?task_id=${mockTaskId}`
    );
  });

  it('should handle API error', async () => {
    // arrange
    const mockTaskId = '123';
    const mockClient = {
      get: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = getTaskComments(mockTaskId);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to get task comments: API Error'
    );
  });
});

describe('createTaskComment', () => {
  it('should create a new comment on a task successfully', async () => {
    // arrange
    const mockTaskId = '123';
    const mockContent = 'This is a new comment';
    const expectedContent =
      'This is a new comment\n\n*(commented using Claude)*';
    const mockResponse = {
      id: '456',
      task_id: '123',
      project_id: '789',
      posted: '2024-01-03T12:00:00Z',
      content: expectedContent,
      attachment: null,
      posted_uid: 'user1',
      uids_to_notify: [],
      is_rtl: false,
      reactions: {},
    };

    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({ data: mockResponse }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await createTaskComment(mockTaskId, mockContent);

    // assert
    expect(result).toEqual({
      id: 456,
      content: expectedContent,
      posted: '2024-01-03T12:00:00Z',
      posted_uid: 'user1',
      attachment: null,
    });
    expect(mockClient.post).toHaveBeenCalledWith('/comments', {
      task_id: mockTaskId,
      content: expectedContent,
    });
  });

  it('should handle API error when creating comment', async () => {
    // arrange
    const mockTaskId = '123';
    const mockContent = 'This is a new comment';
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = createTaskComment(mockTaskId, mockContent);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to create task comment: API Error'
    );
  });
});

describe('addTaskRenameComment', () => {
  it('should create a comment noting the task was renamed with old and new titles', async () => {
    // arrange
    const mockTaskId = '123';
    const mockOldTitle = 'Old Task Title';
    const mockNewTitle = 'New Task Title';
    const expectedContent = `Task renamed from \`${mockOldTitle}\` to \`${mockNewTitle}\`\n\n*(renamed using Claude)*`;
    const mockResponse = {
      id: '789',
      task_id: '123',
      project_id: '456',
      posted: '2024-01-04T13:00:00Z',
      content: expectedContent,
      attachment: null,
      posted_uid: 'user1',
      uids_to_notify: [],
      is_rtl: false,
      reactions: {},
    };

    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({ data: mockResponse }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await addTaskRenameComment(
      mockTaskId,
      mockOldTitle,
      mockNewTitle
    );

    // assert
    expect(result).toEqual({
      id: 789,
      content: expectedContent,
      posted: '2024-01-04T13:00:00Z',
      posted_uid: 'user1',
      attachment: null,
    });
    expect(mockClient.post).toHaveBeenCalledWith('/comments', {
      task_id: mockTaskId,
      content: expectedContent,
    });
  });

  it('should handle API error when creating rename comment', async () => {
    // arrange
    const mockTaskId = '123';
    const mockOldTitle = 'Old Task Title';
    const mockNewTitle = 'New Task Title';
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = addTaskRenameComment(
      mockTaskId,
      mockOldTitle,
      mockNewTitle
    );

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to add task rename comment: API Error'
    );
  });

  it('should handle client without post method', async () => {
    // arrange
    const mockTaskId = '123';
    const mockOldTitle = 'Old Task Title';
    const mockNewTitle = 'New Task Title';
    const mockClient = {
      get: vi.fn(),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = addTaskRenameComment(
      mockTaskId,
      mockOldTitle,
      mockNewTitle
    );

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to add task rename comment: POST method not available on client'
    );
  });
});

describe('createAutomatedTaskComment', () => {
  it('should create an automated comment with appropriate signature', async () => {
    // arrange
    const mockTaskId = '123';
    const mockContent = 'This is an automated action';
    const expectedContent = `This is an automated action\n\n*(automated comment from Claude)*`;
    const mockResponse = {
      id: '999',
      task_id: '123',
      project_id: '456',
      posted: '2024-01-05T14:00:00Z',
      content: expectedContent,
      attachment: null,
      posted_uid: 'user1',
      uids_to_notify: [],
      is_rtl: false,
      reactions: {},
    };

    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockResolvedValue({ data: mockResponse }),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const result = await createAutomatedTaskComment(mockTaskId, mockContent);

    // assert
    expect(result).toEqual({
      id: 999,
      content: expectedContent,
      posted: '2024-01-05T14:00:00Z',
      posted_uid: 'user1',
      attachment: null,
    });
    expect(mockClient.post).toHaveBeenCalledWith('/comments', {
      task_id: mockTaskId,
      content: expectedContent,
    });
  });

  it('should handle API error when creating automated comment', async () => {
    // arrange
    const mockTaskId = '123';
    const mockContent = 'This is an automated action';
    const mockClient = {
      get: vi.fn(),
      post: vi.fn().mockRejectedValue(new Error('API Error')),
    };
    mockGetTodoistClient.mockReturnValue(mockClient);

    // act
    const promise = createAutomatedTaskComment(mockTaskId, mockContent);

    // assert
    await expect(promise).rejects.toThrow(
      'Failed to create automated task comment: API Error'
    );
  });
});
