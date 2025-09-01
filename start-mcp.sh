#!/bin/bash

# Change to the script's directory to ensure correct working directory
cd "$(dirname "$0")"

# Environment variables are loaded by the MCP server itself

# Logging disabled - no longer writing to logs directory
# All output will go to stderr/stdout only

# Start the MCP server
npx tsx src/index.ts
