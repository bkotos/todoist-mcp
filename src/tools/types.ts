import type { Tool as McpTool } from '@modelcontextprotocol/sdk/types';

/**
 * Tool interface for MCP tools
 * Each tool implements this interface with a schema and handler
 * Uses the official MCP SDK Tool type for the schema
 */

export interface Tool<TArgs = any> {
  schema: McpTool;
  handler: (args?: TArgs) => Promise<{
    content: Array<{
      type: string;
      text: string;
    }>;
  }>;
}
