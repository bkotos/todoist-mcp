import express from 'express';
import { config } from 'dotenv';
import { updateTaskTool } from './tools/task-operations';
import { handleToolRequest } from './handlers/tool-request-handler';

// Load environment variables
config();

export function createDebugServer(): express.Application {
  const app = express();

  // Enable JSON parsing
  app.use(express.json());

  // Generic tool invocation endpoint
  app.post('/debug/tool/:toolName', async (req, res) => {
    try {
      const { toolName } = req.params;
      const args = req.body || {};

      const result = await handleToolRequest({
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args,
        },
      });

      // Parse nested JSON strings in the response
      const parsedResult = {
        ...result,
        content: result.content.map((item) => {
          if (item.type === 'text' && item.text) {
            try {
              return JSON.parse(item.text);
            } catch (parseError) {
              return item.text;
            }
          }
          return item;
        }),
      };

      res.json(parsedResult);
    } catch (error) {
      console.error('Debug tool invocation error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return app;
}

export function startDebugServer(port: number = 3001): void {
  const app = createDebugServer();

  app.listen(port, () => {
    console.log(`Debug server running on http://localhost:${port}`);
    console.log(`Available endpoints:`);
    console.log(
      `  POST /debug/tool/:toolName - Invoke any tool with parameters in request body`
    );
  });
}
