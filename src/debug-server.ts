import express from 'express';
import { config } from 'dotenv';

// Load environment variables
config();

export function createDebugServer(): express.Application {
  const app = express();

  // Main debug endpoint
  app.get('/debug', (req, res) => {
    res.json({ success: true });
  });

  return app;
}

export function startDebugServer(port: number = 3001): void {
  const app = createDebugServer();

  app.listen(port, () => {
    console.log(`Debug server running on http://localhost:${port}`);
    console.log(`Available endpoints:`);
    console.log(`  GET  /debug - Main debug endpoint`);
  });
}
