import { createProjectLabelTool } from './create-project-label';
import type { MockedFunction } from 'vitest';
import { createProjectLabel } from '../services/labels/labels';

// Mock the labels service
vi.mock('../services/labels/labels');

const mockCreateProjectLabel = createProjectLabel as MockedFunction<
  typeof createProjectLabel
>;

describe('create-project-label tool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createProjectLabelHandler', () => {
    it('should create a project label successfully', async () => {
      // arrange
      const mockResult = {
        id: 123,
        name: 'PROJECT: New Website',
        color: 'charcoal',
        order: 1,
        is_favorite: false,
      };
      mockCreateProjectLabel.mockResolvedValue(mockResult);

      // act
      const result = await createProjectLabelTool.handler({
        project_name: 'PROJECT: New Website',
      });

      // assert
      expect(result).toEqual({
        content: [
          {
            type: 'text',
            text: JSON.stringify(mockResult, null, 2),
          },
        ],
      });
      expect(mockCreateProjectLabel).toHaveBeenCalledWith(
        'PROJECT: New Website'
      );
    });

    it('should handle missing project_name parameter', async () => {
      // arrange
      mockCreateProjectLabel.mockResolvedValue({
        id: 123,
        name: 'PROJECT: Test',
        color: 'charcoal',
        order: 1,
        is_favorite: false,
      });

      // act
      const promise = createProjectLabelTool.handler({ project_name: '' });

      // assert
      await expect(promise).rejects.toThrow('project_name is required');
      expect(mockCreateProjectLabel).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      // arrange
      mockCreateProjectLabel.mockRejectedValue(
        new Error('Project label name must start with "PROJECT: "')
      );

      // act
      const promise = createProjectLabelTool.handler({
        project_name: 'Invalid Name',
      });

      // assert
      await expect(promise).rejects.toThrow(
        'Project label name must start with "PROJECT: "'
      );
      expect(mockCreateProjectLabel).toHaveBeenCalledWith('Invalid Name');
    });

    it('should handle API errors from the service', async () => {
      // arrange
      mockCreateProjectLabel.mockRejectedValue(
        new Error('Failed to create project label: API Error')
      );

      // act
      const promise = createProjectLabelTool.handler({
        project_name: 'PROJECT: Test Project',
      });

      // assert
      await expect(promise).rejects.toThrow(
        'Failed to create project label: API Error'
      );
      expect(mockCreateProjectLabel).toHaveBeenCalledWith(
        'PROJECT: Test Project'
      );
    });
  });
});
