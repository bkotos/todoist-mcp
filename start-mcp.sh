#!/bin/bash

# Change to the script's directory to ensure correct working directory
cd "$(dirname "$0")"

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Logging disabled - no longer writing to logs directory
# All output will go to stderr/stdout only

# Start the MCP server
npx tsx src/index.ts
