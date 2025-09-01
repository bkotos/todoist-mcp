#!/usr/bin/env node

import { startDebugServer } from './debug-server';

const port = parseInt(process.env.DEBUG_PORT || '3001', 10);

console.log('Starting Todoist MCP Debug Server...');
console.log(`Port: ${port}`);

startDebugServer(port);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down debug server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down debug server...');
  process.exit(0);
});

// Add global error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
