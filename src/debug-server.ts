import express from 'express';
import { config } from 'dotenv';
import { updateTaskHandler } from './tools/update-task';

// Load environment variables
config();

export function createDebugServer(): express.Application {
  const app = express();

  // Enable JSON parsing
  app.use(express.json());

  // Main debug endpoint
  app.get('/debug', (req, res) => {
    res.json({ success: true });
  });

  // Update task endpoint
  app.get('/debug/update-task', async (req, res) => {
    try {
      const result = await updateTaskHandler({
        task_id: '9498012720',
        project_id: '2322804039',
        // title: 'Updated via debug server',
      });

      res.json(result);
    } catch (error) {
      console.error('Debug update task error:', error);
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
    console.log(`  GET  /debug - Main debug endpoint`);
    console.log(
      `  GET  /debug/update-task - Update task with task_id and project_id`
    );
  });
}
