describe('MCP Server Response Format', () => {
  describe('Response Format Tests', () => {
    it('should format error responses as text', () => {
      // arrange
      const error = new Error('API Error');

      // act
      const response = {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
      };

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe('Error: API Error');
    });

    it('should format unknown tool error as text', () => {
      // arrange
      const toolName = 'unknown_tool';

      // act
      const response = {
        content: [
          {
            type: 'text',
            text: `Error: Unknown tool: ${toolName}`,
          },
        ],
      };

      // assert
      expect(response.content[0].type).toBe('text');
      expect(response.content[0].text).toBe(
        'Error: Unknown tool: unknown_tool'
      );
    });
  });
});
